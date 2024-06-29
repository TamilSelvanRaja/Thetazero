import 'package:flutter/material.dart';
import 'package:promilo/constants/colors.dart' as clr;

class UiHelper {
  ///******** Vertically Space Widgets **********///
  static const Widget verticalSpaceTiny = SizedBox(height: 4.0);
  static const Widget verticalSpaceSmall = SizedBox(height: 10.0);
  static const Widget verticalSpaceMedium = SizedBox(height: 20.0);

  ///******** Horizontal Space Widgets **********///
  static const Widget horizontalSpaceTiny = SizedBox(width: 5.0);
  static const Widget horizontalSpaceSmall = SizedBox(width: 10.0);
  static const Widget horizontalSpaceMedium = SizedBox(width: 20.0);

  ///******** Text with style Widgets **********///
  static Widget customText(String title, double fntsize,
      {Color color = Colors.black,
      bool isBold = false,
      bool isCenterAlignment = false,
      bool isUnderline = false,
      bool isellipsis = false}) {
    return Text(
      title,
      overflow: isellipsis ? TextOverflow.ellipsis : null,
      style: TextStyle(
        color: color,
        fontSize: fntsize,
        decoration:
            isUnderline ? TextDecoration.underline : TextDecoration.none,
        fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      ),
      textAlign: isCenterAlignment ? TextAlign.center : TextAlign.left,
    );
  }

  ///******** Container BOX Decoration **********///
  static BoxDecoration roundedBorderWithColor(
      double radius, Color backgroundColor,
      {Color borderColor = clr.transparentColor,
      double borderWidth = 1,
      bool isShadow = false,
      Color shadowcolor = Colors.black45}) {
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

  ///******** Container BOX Decoration with baackground image **********///
  static BoxDecoration roundedBorderWithBackround(
      double radius, String imageurl) {
    return BoxDecoration(
      borderRadius: BorderRadius.all(Radius.circular(radius)),
      image: DecorationImage(
        image: AssetImage(imageurl),
        fit: BoxFit.cover,
      ),
    );
  }

  ///******** Container BOX Decoration **********///
  static BoxDecoration customEdgesDecoration(Color backgroundColor,
      double ltradius, double lbradius, double rtradius, double rbradius) {
    return BoxDecoration(
      borderRadius: BorderRadius.only(
          topLeft: Radius.circular(ltradius),
          bottomLeft: Radius.circular(lbradius),
          topRight: Radius.circular(rtradius),
          bottomRight: Radius.circular(rbradius)),
      color: backgroundColor,
    );
  }

  ///******** Custom Input Field Style Widgets **********///
  static OutlineInputBorder getInputBorder(double width,
      {double radius = 10, Color borderColor = Colors.transparent}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.all(Radius.circular(radius)),
      borderSide: BorderSide(color: borderColor, width: width),
      gapPadding: 10,
    );
  }

  ///******** Circle Container Decoration Widgets **********///
  static BoxDecoration circledecorationWithColor(Color backgroundColor,
      {Color borderColor = Colors.transparent,
      double borderWidth = 1,
      Color shadowcolor = Colors.black26}) {
    return BoxDecoration(
      shape: BoxShape.circle,
      border: Border.all(width: borderWidth, color: borderColor),
      color: backgroundColor,
    );
  }

  ///******** Custom Button with style Widgets **********///
  Widget customButton(String title, Function press,
      {Color bgclr = clr.primaryColor,
      Color textclr = clr.white,
      double btnWidth = 100}) {
    return GestureDetector(
        onTap: () {
          press();
        },
        child: Container(
          width: btnWidth,
          alignment: Alignment.center,
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
          decoration: roundedBorderWithColor(10, bgclr,
              borderColor: clr.primaryColor, borderWidth: 2),
          child: customText(title, 16, isBold: true, color: textclr),
        ));
  }

  ///******** Loading Widgets **********///
  static Widget loaderWidget() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }
}
