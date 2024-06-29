import 'package:flutter/material.dart';
import 'package:promilo/constants/image_paths.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/constants/strings.dart' as str;

class TrendingMeetups extends StatelessWidget {
  TrendingMeetups({super.key});

  final List imageList = [image0, image1, image2, image3, image4];
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          UiHelper.customText(str.trendingMeetup, 18, isBold: true),
          UiHelper.verticalSpaceSmall,
          SizedBox(
              height: Screen.width(context) / 2,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: 5,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: UiHelper.roundedBorderWithBackround(
                        15, imageList[index]),
                    height: Screen.width(context) / 2,
                    width: Screen.width(context) / 2.3,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          height: 60,
                          width: 60,
                          decoration: UiHelper.customEdgesDecoration(
                              clr.white, 15, 0, 0, 15),
                          alignment: Alignment.center,
                          child: UiHelper.customText("0${index + 1}", 35,
                              isBold: true),
                        ),
                      ],
                    ),
                  );
                },
                separatorBuilder: (context, index) {
                  return UiHelper.horizontalSpaceSmall;
                },
              )),
        ],
      ),
    );
  }
}
