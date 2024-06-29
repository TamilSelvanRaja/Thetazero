import 'package:flutter/material.dart';
import 'package:promilo/constants/image_paths.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/constants/strings.dart' as str;

class PopularPeoples extends StatelessWidget {
  PopularPeoples({super.key});
  final heading = [
    {"title": "Author", "hint": "1,028 Meetups", "icon": meetImage},
    {"title": "Owner", "hint": "1,000 Meetups", "icon": exploreImage},
    {"title": "Investors", "hint": "728 Meetups", "icon": userImage}
  ];
  final List imageList = [image0, image1, image2, image3, image4];
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          UiHelper.customText(str.popularPeople, 18,
              isBold: true, color: clr.textcolor),
          UiHelper.verticalSpaceSmall,
          SizedBox(
              height: Screen.width(context) / 2.3,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: 3,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: UiHelper.roundedBorderWithColor(10, clr.white,
                        borderColor: clr.grey01),
                    height: Screen.width(context) / 2.3,
                    width: Screen.width(context) / 1.5,
                    padding: const EdgeInsets.all(10),
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                decoration: UiHelper.circledecorationWithColor(
                                    clr.white,
                                    borderColor: clr.textcolor,
                                    borderWidth: 2),
                                height: 40,
                                width: 40,
                                padding: const EdgeInsets.all(8),
                                child: Image.asset(
                                  heading[index]['icon']!,
                                  fit: BoxFit.cover,
                                  color: clr.textcolor,
                                ),
                              ),
                              UiHelper.horizontalSpaceSmall,
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  UiHelper.customText(
                                      heading[index]['title']!, 14,
                                      color: clr.textcolor, isBold: true),
                                  UiHelper.customText(
                                      heading[index]['hint']!, 13,
                                      color: clr.grey02),
                                ],
                              )
                            ],
                          ),
                          const Spacer(),
                          Container(height: 1, color: clr.grey01),
                          const Spacer(),
                          rowImagesWidget(),
                          UiHelper.verticalSpaceSmall,
                          Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              width: Screen.width(context) / 3,
                              alignment: Alignment.center,
                              padding: const EdgeInsets.fromLTRB(15, 8, 15, 8),
                              decoration: UiHelper.roundedBorderWithColor(
                                  10, clr.textcolor),
                              child: UiHelper.customText("See more", 14,
                                  isBold: true, color: clr.white),
                            ),
                          )
                        ]),
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

  Widget rowImagesWidget() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: List.generate(
        imageList.length,
        (index) => Container(
          decoration: UiHelper.circledecorationWithColor(clr.white),
          height: 35,
          width: 35,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(50),
            child: Image.asset(imageList[index], fit: BoxFit.cover),
          ),
        ),
      ),
    );
  }
}
