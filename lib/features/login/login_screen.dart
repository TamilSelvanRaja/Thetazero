import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/constants/strings.dart' as str;
import 'package:promilo/features/login/widgets/dot_text_widget.dart';
import 'package:promilo/features/login/widgets/footer.dart';
import 'package:promilo/features/login/widgets/other_signnin.dart';
import 'package:promilo/layouts/custom_input.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/services/routes_services.dart';

class LoginScreenView extends StatefulWidget {
  const LoginScreenView({super.key});
  @override
  State<LoginScreenView> createState() => _LoginScreenViewState();
}

class _LoginScreenViewState extends State<LoginScreenView> {
  bool remember = false;
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SingleChildScrollView(
          child: Container(
            alignment: Alignment.center,
            height: Screen.height(context),
            width: Screen.width(context),
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                UiHelper.verticalSpaceSmall,
                UiHelper.customText(str.appname, 23, isBold: true),
                const Spacer(),
                UiHelper.customText(str.welcomeText, 20, isBold: true),
                const Spacer(),
                formfieldsWidget(context),
                const Spacer(),
                const DotwithText(),
                const Spacer(),
                OtherSignIn(),
                const Spacer(),
                const FooterContent(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget formfieldsWidget(BuildContext context) {
    return Column(
      children: [
        CustomInput(
          lableText: str.signinHint,
          hintText: str.useridLabel,
          fieldname: "userid",
          fieldType: "email",
          validating: (val) {
            return null;
          },
        ),
        UiHelper.verticalSpaceSmall,
        Row(
          children: [
            const Spacer(),
            UiHelper.customText(str.signinotp, 15,
                color: clr.primaryColor, isBold: true)
          ],
        ),
        UiHelper.verticalSpaceSmall,
        CustomInput(
          lableText: str.password,
          hintText: str.enterpassword,
          fieldname: "password",
          fieldType: "password",
          validating: (val) {
            return null;
          },
        ),
        // CustomPasswordField(
        //   controller: passcontroller,
        //   hintText: "Password",
        //   validator: (val) {
        //     if (val == "" || val == null) {
        //       return "Passord is Required";
        //     } else if (!isPasswordValid(val)) {
        //       return "* Need to both lower and upper case characters,\n* Need to at least one symbol & number,\n* be at least 8 characters long.";
        //     } else {
        //       return null;
        //     }
        //   },
        // ),
        Row(
          children: [
            Checkbox(
              value: remember,
              activeColor: clr.primaryColor,
              onChanged: (value) {
                setState(() {
                  remember = value!;
                });
              },
            ),
            Text(str.rememberme),
            const Spacer(),
            UiHelper.customText(str.forgetpass, 15,
                color: clr.primaryColor, isBold: true)
          ],
        ),
        UiHelper.verticalSpaceMedium,
        UiHelper().customButton(
          str.submit,
          () {
            Get.toNamed(RoutePath.landing);
          },
          bgclr: clr.disabledColor,
          textclr: clr.white,
          btnWidth: Screen.width(context),
        )
      ],
    );
  }
}
