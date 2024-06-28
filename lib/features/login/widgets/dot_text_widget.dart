import 'package:flutter/material.dart';
import 'package:promilo/layouts/dotted_line.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;

class DotwithText extends StatelessWidget {
  const DotwithText({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: CustomPaint(
            painter: DottedLinePainter(color: clr.grey02),
            size: const Size(double.infinity, 1),
          ),
        ),
        Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: UiHelper.customText("Or", 14)),
        Expanded(
          child: CustomPaint(
            painter: DottedLinePainter(color: clr.grey02),
            size: const Size(double.infinity, 1),
          ),
        ),
      ],
    );
  }
}
