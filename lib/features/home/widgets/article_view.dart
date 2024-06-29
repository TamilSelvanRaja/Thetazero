import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:promilo/constants/image_paths.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;

class ArticlesSlider extends StatelessWidget {
  ArticlesSlider({super.key});

  final List<Map<String, String>> featuredArticles = [
    {"title": "Popular Meetups\nin India", "image": image5},
    {"title": "Popular Meetups\nin America", "image": image6},
    {"title": "Popular Meetups\nin China", "image": image7},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 0),
      child: Column(
        children: [
          CarouselSlider.builder(
            itemCount: featuredArticles.length,
            options: CarouselOptions(
              autoPlay: true,
              enlargeCenterPage: true,
              // height: 250,
              viewportFraction: 1,
            ),
            itemBuilder: (context, index, realIndex) {
              return Column(
                children: [
                  Container(
                    width: double.infinity,
                    decoration: UiHelper.roundedBorderWithBackround(20, featuredArticles[index]["image"]!),
                    child: Container(
                      height: 170,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        gradient: LinearGradient(
                            colors: [
                              clr.black.withOpacity(0.5),
                              Colors.transparent,
                            ],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            stops: const [0.4, 0.7],
                            tileMode: TileMode.clamp),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          UiHelper.customText(featuredArticles[index]["title"]!, 20, isellipsis: true, isBold: true, color: clr.white),
                        ],
                      ),
                    ),
                  ),
                  UiHelper.dotStyleWidget(3, index, clr.black)
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
