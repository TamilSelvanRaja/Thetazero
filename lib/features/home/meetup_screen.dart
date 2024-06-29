import 'package:flutter/material.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/constants/image_paths.dart';
import 'package:promilo/features/home/widgets/article_view.dart';
import 'package:promilo/features/home/widgets/popular_peoples.dart';
import 'package:promilo/features/home/widgets/trending_meetup.dart';
import 'package:promilo/layouts/custom_input.dart';
import 'package:promilo/layouts/ui_helper.dart';

class MeetUpScreenView extends StatefulWidget {
  const MeetUpScreenView({super.key});
  @override
  State<MeetUpScreenView> createState() => _MeetUpScreenViewState();
}

class _MeetUpScreenViewState extends State<MeetUpScreenView> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        UiHelper.customAppBar("Indidual Meetup"),
        UiHelper.smallLine(),
        Expanded(
          child: SingleChildScrollView(
            child: Container(
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                    child: CustomInput(
                      hintText: "Search",
                      lableText: "",
                      fieldname: "",
                      onEnter: (value) {},
                      validating: (val) {
                        return null;
                      },
                      fieldType: "text",
                      prefixwidget: SizedBox(
                          height: 5,
                          width: 5,
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Image.asset(
                              search,
                              color: clr.secondaryColor,
                            ),
                          )),
                      suffixWidget: SizedBox(
                          height: 5,
                          width: 5,
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Image.asset(
                              mic,
                              color: clr.secondaryColor,
                            ),
                          )),
                    ),
                  ),
                  ArticlesSlider(),
                  PopularPeoples(),
                  UiHelper.verticalSpaceSmall,
                  TrendingMeetups(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
