import 'package:flutter/material.dart';
import 'package:promilo/features/home/description/widgets/action_holder.dart';
import 'package:promilo/features/home/description/widgets/photo_frame.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/colors.dart' as clr;

class DescriptionView extends StatefulWidget {
  const DescriptionView({super.key});
  @override
  State<DescriptionView> createState() => _DescriptionViewState();
}

class _DescriptionViewState extends State<DescriptionView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        top: true,
        child: Column(
          children: [
            UiHelper.customAppBar("Description"),
            UiHelper.smallLine(),
            Expanded(
              child: SingleChildScrollView(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      PhotoFrame(),
                      UiHelper.verticalSpaceSmall,
                      const ActionHolders(),
                      UiHelper.verticalSpaceMedium,
                      UiHelper.customText("Actor Name", 18,
                          isBold: true, color: clr.textcolor),
                      UiHelper.customText("Indian Actress", 14,
                          isBold: true, color: clr.grey01),
                      UiHelper.verticalSpaceSmall,
                      Row(
                        children: [
                          const Icon(Icons.query_builder_outlined,
                              size: 20, color: clr.grey01),
                          UiHelper.horizontalSpaceTiny,
                          UiHelper.customText("Duration 20 Mins", 14,
                              isBold: true, color: clr.grey01),
                        ],
                      ),
                      UiHelper.verticalSpaceSmall,
                      Row(
                        children: [
                          const Icon(Icons.account_balance_wallet_outlined,
                              size: 20, color: clr.grey01),
                          UiHelper.horizontalSpaceTiny,
                          UiHelper.customText("Total Average Fees ₹9,999", 14,
                              isBold: true, color: clr.grey01),
                        ],
                      ),
                      UiHelper.verticalSpaceMedium,
                      UiHelper.customText("About", 18,
                          isBold: true, color: clr.textcolor),
                      UiHelper.customText(
                          "In Flutter, the term description can refer to several different concepts depending on the context in which it's used. Here’s an overview of what description might mean in different scenarios within Flutter development",
                          14,
                          isBold: true,
                          color: clr.grey01),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
