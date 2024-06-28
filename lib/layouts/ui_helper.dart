import 'dart:io';

import 'package:flutter/material.dart';
import 'package:promilo/constants/colors.dart' as clr;

class UiHelper {
  ///******** Vertically Space Provider **********///
  static const Widget verticalSpaceTiny = SizedBox(height: 4.0);
  static const Widget verticalSpaceSmall = SizedBox(height: 10.0);
  static const Widget verticalSpaceMedium = SizedBox(height: 20.0);

  ///******** Horizontal Space provider **********///
  static const Widget horizontalSpaceTiny = SizedBox(width: 5.0);
  static const Widget horizontalSpaceSmall = SizedBox(width: 10.0);
  static const Widget horizontalSpaceMedium = SizedBox(width: 20.0);

  static Widget textStyle(String title, double fntsize, {Color color = Colors.black, bool isBold = false, bool isCenterAlignment = false, bool isUnderline = false, bool isellipsis = false}) {
    return Text(
      title,
      overflow: isellipsis ? TextOverflow.ellipsis : null,
      style: TextStyle(
        color: color,
        fontSize: fntsize,
        decoration: isUnderline ? TextDecoration.underline : TextDecoration.none,
        fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      ),
      textAlign: isCenterAlignment ? TextAlign.center : TextAlign.left,
    );
  }

  ///******** Container BOX Decoration **********///
  static BoxDecoration roundedBorderWithColor(double radius, Color backgroundColor,
      {Color borderColor = clr.transparentColor, double borderWidth = 1, bool isShadow = false, Color shadowcolor = Colors.black45}) {
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

  static Widget loaderUi() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  // Input Box Style Provider
  static OutlineInputBorder getInputBorder(double width, {double radius = 28, Color borderColor = Colors.transparent}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.all(Radius.circular(radius)),
      borderSide: BorderSide(color: borderColor, width: width),
      gapPadding: 10,
    );
  }

// Form builder Input Fields Decoration
  static InputDecoration inputDecorateWidget(String labelText, {final suffixWidget}) {
    return InputDecoration(
      labelText: labelText,
      suffixIcon: suffixWidget,
      labelStyle: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: Colors.black38),
      enabledBorder: getInputBorder(1, borderColor: Colors.black38),
      focusedBorder: getInputBorder(1, borderColor: Colors.black38),
      focusedErrorBorder: getInputBorder(1, borderColor: Colors.red),
      errorBorder: getInputBorder(1, borderColor: Colors.red),
      disabledBorder: getInputBorder(1, borderColor: Colors.black38),
      errorStyle: const TextStyle(fontSize: 10),
      floatingLabelStyle: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.w500, color: Colors.black87),
      contentPadding: const EdgeInsets.symmetric(horizontal: 42, vertical: 20),
    );
  }

  static BoxDecoration circleWithColorWithShadow(Color backgroundColor, Color backgroundColor2, {Color borderColor = Colors.transparent, double borderWidth = 1, Color shadowcolor = Colors.black26}) {
    return BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(width: borderWidth, color: borderColor),
        gradient: LinearGradient(
            colors: [
              backgroundColor,
              backgroundColor2,
            ],
            begin: const FractionalOffset(0.0, 0.0),
            end: const FractionalOffset(1.0, 0.0),
            stops: const [0.0, 1.0],
            tileMode: TileMode.clamp),
        boxShadow: [
          BoxShadow(
            color: shadowcolor,
            offset: const Offset(2, 2),
            blurRadius: 3.0,
          )
        ]);
  }

  Widget showprofile(String profileUrl, double hwsize) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(100.0),
      child: profileUrl.startsWith("https") || profileUrl.startsWith("http")
          ? Image.network(
              profileUrl,
              height: hwsize,
              width: hwsize,
              fit: BoxFit.cover,
            )
          : Image.file(
              File(profileUrl),
              height: hwsize,
              width: hwsize,
              fit: BoxFit.cover,
            ),
    );
  }

  Widget customSmallButton(Function press, String title, {Color bgclr = clr.primaryColor, Color textclr = clr.white}) {
    return Align(
        alignment: Alignment.centerRight,
        child: GestureDetector(
            onTap: () {
              press();
            },
            child: Container(
              width: 300,
              alignment: Alignment.center,
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
              decoration: roundedBorderWithColor(15, bgclr),
              child: textStyle(title, 15, isBold: true, color: textclr),
            )));
  }
}
