import 'package:flutter/material.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/strings.dart' as str;
import 'package:promilo/constants/colors.dart' as clr;

class FooterContent extends StatelessWidget {
  const FooterContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          UiHelper.customText(str.bussinessuser, 15,
              color: clr.grey01, isBold: true),
          UiHelper.customText(str.withoutac, 15,
              color: clr.grey01, isBold: true)
        ],
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          UiHelper.customText(str.loginText, 15,
              color: clr.primaryColor, isBold: true),
          UiHelper.customText(str.signupText, 15,
              color: clr.primaryColor, isBold: true)
        ],
      ),
      UiHelper.verticalSpaceSmall,
      UiHelper.customText(str.terms1, 14, color: clr.grey01),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          UiHelper.customText("Promillo's", 14, color: clr.grey01),
          UiHelper.horizontalSpaceTiny,
          UiHelper.customText(str.terms2, 15, isBold: true),
        ],
      ),
      Container(
        height: 5,
        margin: const EdgeInsets.only(top: 5),
        width: Screen.width(context) / 2,
        decoration: UiHelper.roundedBorderWithColor(
            30, clr.primaryColor.withOpacity(0.4)),
      )
    ]);
  }
}
