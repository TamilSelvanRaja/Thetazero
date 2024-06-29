import 'package:flutter/material.dart';

class Screen {
  static Size size(BuildContext c) => MediaQuery.of(c).size; //Device Size
  static double width(BuildContext c) => size(c).width; // Device width
  static double height(BuildContext c) => size(c).height; // Device height
}
