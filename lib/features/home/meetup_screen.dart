import 'package:flutter/material.dart';
import 'package:promilo/constants/strings.dart' as str;
import 'package:promilo/features/login/widgets/dot_text_widget.dart';
import 'package:promilo/features/login/widgets/footer.dart';
import 'package:promilo/features/login/widgets/other_signnin.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';

class MeetUpScreenView extends StatefulWidget {
  const MeetUpScreenView({super.key});
  @override
  State<MeetUpScreenView> createState() => _MeetUpScreenViewState();
}

class _MeetUpScreenViewState extends State<MeetUpScreenView> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        alignment: Alignment.center,
        height: Screen.height(context),
        width: Screen.width(context),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            UiHelper.customText(str.appname, 23, isBold: true),
            const Spacer(),
            UiHelper.customText(str.welcomeText, 20, isBold: true),
            const Spacer(),
            const DotwithText(),
            const Spacer(),
            OtherSignIn(),
            const Spacer(),
            const FooterContent(),
          ],
        ),
      ),
    );
  }
}
