import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:promilo/constants/image_paths.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/services/utils.dart';

class PhotoFrame extends StatelessWidget {
  PhotoFrame({super.key});

  final List imageList = [image6, image7, image1, image3, image2];
  final List iconData = [
    Icons.file_download_outlined,
    Icons.bookmark_border_outlined,
    Icons.favorite_border_outlined,
    Icons.aspect_ratio_outlined,
    Icons.grade_outlined,
    Icons.share_outlined,
  ];
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration:
          UiHelper.roundedBorderWithColor(10, clr.grey01.withOpacity(0.3)),
      child: Column(
        children: [
          CarouselSlider.builder(
            itemCount: imageList.length,
            options: CarouselOptions(
              autoPlay: true,
              enlargeCenterPage: true,
              height: Screen.width(context),
              viewportFraction: 1,
            ),
            itemBuilder: (context, index, realIndex) {
              return Container(
                width: double.infinity,
                decoration:
                    UiHelper.roundedBorderWithBackround(10, imageList[index]!),
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: UiHelper.dotStyleWidget(
                      imageList.length, index, clr.white),
                ),
              );
            },
          ),
          SizedBox(
              height: 50,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(6, (index) {
                  return GestureDetector(
                      onTap: () {
                        if (index == 5) {
                          Utils().share();
                        }
                      },
                      child: Icon(iconData[index]));
                }),
              ))
        ],
      ),
    );
  }
}
