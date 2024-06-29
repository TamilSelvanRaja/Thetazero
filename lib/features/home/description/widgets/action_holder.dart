import 'package:flutter/material.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/layouts/ui_helper.dart';

class ActionHolders extends StatelessWidget {
  const ActionHolders({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        rowWiseIcon("1034", const Icon(Icons.bookmark_border_outlined, size: 15, color: clr.textcolor), clr.black),
        UiHelper.horizontalSpaceSmall,
        rowWiseIcon("1034", const Icon(Icons.favorite_border_outlined, size: 15, color: clr.textcolor), clr.black),
        UiHelper.horizontalSpaceSmall,
        rowWiseIcon(
            "3.2",
            Container(
              decoration: UiHelper.roundedBorderWithColor(15, clr.grey01.withOpacity(0.2)),
              padding: const EdgeInsets.all(2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: List.generate(5, (index) {
                  return const Padding(
                    padding: EdgeInsets.fromLTRB(3, 0, 3, 0),
                    child: Icon(
                      Icons.star,
                      size: 15,
                      color: clr.textcolor,
                    ),
                  );
                }),
              ),
            ),
            clr.textcolor)
      ],
    );
  }

  Widget rowWiseIcon(String hint, Widget icon, Color textclr) {
    return Row(
      children: [icon, UiHelper.horizontalSpaceTiny, UiHelper.customText("1034", 14, isBold: true, color: textclr)],
    );
  }
}
