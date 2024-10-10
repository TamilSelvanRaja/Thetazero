import 'package:flutter/material.dart';

class UIHelper {
  ///******** Vertically Space  **********///
  static const Widget verticalSpaceSmall = SizedBox(height: 10.0);
  static const Widget verticalSpaceMedium = SizedBox(height: 20.0);

  ///******** horizantal Space  **********///
  static const Widget horizantalSpaceSmall = SizedBox(width: 5.0);
  static const Widget horizantalSpaceMedium = SizedBox(width: 10.0);

  ///******** Container BOX Decoration **********///
  static BoxDecoration roundedBorderWithColor(double radius, Color backgroundColor, {Color borderColor = Colors.transparent, double borderWidth = 1, bool isShadow = false, Color shadowcolor = Colors.black45}) {
    return BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(radius)),
        border: Border.all(width: borderWidth, color: borderColor),
        color: backgroundColor,
        boxShadow: isShadow
            ? [
                BoxShadow(
                  color: shadowcolor,
                  offset: const Offset(2, 2),
                  blurRadius: 3.0,
                )
              ]
            : []);
  }
}
