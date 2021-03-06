<?php

/**
 * @file
 * Anomaly detection functions.
 *
 * Copyright (c) 2012 Fraunhofer Institut ITWM (www.itwm.fraunhofer.de)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

//DEBUG
//error_reporting(E_ALL);
//ini_set('display_errors', TRUE);
//ini_set('display_startup_errors', TRUE);

#TODO: get rid of these magic numbers
define('ANOMALY_MIN_TOLERANCE',       10);
define('NEIGHBOUR_DISTANCE',         0.7);
define('ANOMALY_MIN_SAMPLE_SIZE',      6);
define('FLAT_LINE_ANOMALY_MIN_VALUES', 15);

/**
 * Detects anomalies on power production measurements.
 *
 * @param $sensor     The sensor whose measurements will be analyzed.
 * @param $unit       The measurement unit.
 * @param $period     The time period.
 * @param $resolution The measurement resolution.
 * @param $max        Maximum number of anomalies to be returned (optional).
 * @return the array of anomalous values, indexed by timestamp.
 */
function logger_detect_production_anomalies($sensor, $unit, $period, $resolution, $max = 0) {

  module_load_include('inc', 'logger', 'logger.rrd');

  $measurements = logger_rrd_query_sensor($sensor, $unit, $period, $resolution);

  $standard_anomalies = logger_detect_standard_anomalies($measurements, $sensor, $resolution);
  //$historical_anomalies = logger_detect_historical_anomalies($measurements);
  //$neighbor_anomalies = logger_detect_neighbor_anomalies($measurements, $sensor, $unit, $period, $resolution);

  $anomalies = array();
  foreach ($measurements as $timestamp => $value) {

    if (
      //the other models need to agree that this is an anomaly
      //isset($historical_anomalies[$timestamp]) && isset($neighbor_anomalies[$timestamp]) ||

      //standard anomalies are always reported
      isset($standard_anomalies[$timestamp])) {

      //Mark a segment as anomalous
      $ts = $timestamp - $resolution;
      if (isset($measurements[$ts])) {
        $anomalies[$ts] = $measurements[$ts];
      }

      $anomalies[$timestamp] = $value;

      $ts = $timestamp + $resolution;
      if (isset($measurements[$ts])) {
        $anomalies[$ts] = $measurements[$ts];
      }
    }
    if ($max > 0 && count($anomalies) >= $max) {
      break;
    }
  }
  return $anomalies;
}

/**
 * Detects standard anomalies on power production measurements.
 *
 * @param $measurements The sensor measurements, indexed by timestamp.
 * @param $sensor       The sensor whose measurements will be analyzed.
 * @param $resolution   The measurement resolution.
 * @return the array of sets, indexed by timestamp.
 */
function logger_detect_standard_anomalies($measurements, $sensor, $resolution) {

  $anomalies = array();
  $repetitions = 0;

  foreach ($measurements as $timestamp => $value) {

    $sun = date_sun_info($timestamp, $sensor->latitude, $sensor->longitude);

    //during the day
    if ($timestamp > $sun['sunrise'] + HOUR && $timestamp < $sun['sunset'] - HOUR) {

      //zero
      if ($value <= 0) {
        $anomalies[$timestamp] = $value;
      }

      //flat line
      if (isset($measurements[$timestamp - $resolution]) && $value == $measurements[$timestamp - $resolution]) {

        if (++$repetitions >= FLAT_LINE_ANOMALY_MIN_VALUES) {

          for ($t = $timestamp - ($repetitions * $resolution); $t <= $timestamp; $t++) {
            if (isset($measurements[$t])) {
              $anomalies[$t] = $measurements[$t];
            }
          }
        }
      }
      else {
        $repetitions = 0;
      }
    }
  }
  return $anomalies;
}

/**
 * Detects anomalies on power production measurements, based on measurements of neighbor sensors.
 *
 * @param $measurements The sensor measurements, indexed by timestamp.
 * @param $sensor       The sensor whose measurements will be analyzed.
 * @param $unit         The measurement unit.
 * @param $period       The time period.
 * @param $resolution   The measurement resolution.
 * @return the array of sets, indexed by timestamp.
 */
function logger_detect_neighbor_anomalies($measurements, $sensor, $unit, $period, $resolution) {

  module_load_include('inc', 'logger', 'logger.rrd');

  $pvs = logger_get_sensors(array(ENERGY_PRODUCTION_SENSOR_TYPE), NULL, FALSE, FALSE, FALSE, array(
    'latitude'  => array(
      $sensor->latitude - NEIGHBOUR_DISTANCE,
      $sensor->latitude + NEIGHBOUR_DISTANCE),
    'longitude' => array(
      $sensor->longitude - NEIGHBOUR_DISTANCE,
      $sensor->longitude + NEIGHBOUR_DISTANCE)
  ));

  $series = array();
  foreach ($pvs as $pv) {

    if (!empty($pv->function) && $pv->meter != $sensor->meter) {

      $values = logger_rrd_query_sensor($pv, $unit, $period, $resolution);

      foreach ($values as $timestamp => $value) {
        if (isset($value)) {
          $series[$timestamp][] = $value;
        }
      }
    }
  }
  return logger_detect_series_anomalies($measurements, $series);
}

/**
 * Detects anomalies on power production measurements, based on historical measurements of the same sensor.
 *
 * @param $measurements  The sensor measurements, indexed by timestamp.
 * @return the array of sets, indexed by timestamp.
 */
function logger_detect_historical_anomalies($measurements) {

  $minute_values = array();
  foreach ($measurements as $timestamp => $value) {
    $t = DAY - ($timestamp % DAY);
    $minute_values[$t][] = $value > 0 ? $value : 0;
  }

  $series = array();
  foreach ($measurements as $timestamp => $value) {
    $t = DAY - ($timestamp % DAY);
    $series[$timestamp] = $minute_values[$t];
  }
  return logger_detect_series_anomalies($measurements, $series);
}

/**
 * Analyzes sensor measurements and returns values considered anomalous when compared with other series.
 * 
 * @param $measurements The sensor measurements, indexed by timestamp.
 * @param $series       Other series of measurements.
 * @return the array of anomalous values.
 */
function logger_detect_series_anomalies($measurements, $series) {

  $anomalies = array();

  foreach ($series as $timestamp => $values) {

    if (count($values) >= ANOMALY_MIN_SAMPLE_SIZE || isset($measurements[$timestamp])) {

      $median = median($values);
      $median_deviation = median_deviation($values, $median);

      if (logger_is_anomalous($measurements[$timestamp], $median, $median_deviation)) {

        $anomalies[$timestamp] = $measurements[$timestamp];
      }
    }
  }
  return $anomalies;
}

/**
 * Checks whether a measurement is too far from a central point.
 *
 * @param $measurement The measurement being tested.
 * @param $center      The center value.
 * @param $tolerance   The maximum distance of a normal value.
 * @return TRUE if it is too far, FALSE otherwise.
 */
function logger_is_anomalous($value, $center, $tolerance) {

  $tolerance *= 2;
  $tolerance = $tolerance < ANOMALY_MIN_TOLERANCE ? ANOMALY_MIN_TOLERANCE : $tolerance;
  return abs($value - $center) > $tolerance;
}
