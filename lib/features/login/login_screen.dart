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
import 'package:promilo/services/api_services.dart';
import 'package:promilo/services/routes_services.dart';
import 'package:promilo/services/utils.dart';

class LoginScreenView extends StatefulWidget {
  const LoginScreenView({super.key});
  @override
  State<LoginScreenView> createState() => _LoginScreenViewState();
}

class _LoginScreenViewState extends State<LoginScreenView> {
  String emailid = "";
  String password = "";

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
          onEnter: (value) {
            if (!Utils().isEmailValid(value)) {
              emailid = "";
            } else {
              emailid = value.toString();
            }
            setState(() {});
          },
          validating: (val) {
            if (val == null || val == "") {
              return "Email ID is required";
            } else if (!Utils().isEmailValid(val)) {
              return "Invalid Email ID";
            } else {
              return null;
            }
          },
        ),
        UiHelper.verticalSpaceSmall,
        Row(
          children: [const Spacer(), UiHelper.customText(str.signinotp, 15, color: clr.primaryColor, isBold: true)],
        ),
        UiHelper.verticalSpaceSmall,
        CustomInput(
          lableText: str.password,
          hintText: str.enterpassword,
          fieldname: "password",
          fieldType: "password",
          onEnter: (value) {
            if (!Utils().isPasswordValid(value)) {
              password = "";
            } else {
              password = value.toString();
            }
            setState(() {});
          },
          validating: (val) {
            if (val == null || val == "") {
              return "Password is required";
            } else if (!Utils().isPasswordValid(val)) {
              return "* Need to both lower and upper case characters,\n* Need to at least one symbol & number,\n* be at least 8 characters long.";
            } else {
              return null;
            }
          },
        ),
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
            UiHelper.customText(str.forgetpass, 15, color: clr.primaryColor, isBold: true)
          ],
        ),
        UiHelper.verticalSpaceMedium,
        UiHelper().customButton(
          str.submit,
          () async {
            Get.toNamed(RoutePath.landing);
            // if (emailid.isNotEmpty && password.isNotEmpty) {
            //   Map<String, dynamic> postparams = {};
            //   postparams['username'] = emailid;
            //   postparams['password'] = Utils().sha256Hash(password);
            //   postparams['grant_type'] = "password";
            //   bool isVerfied = await ApiService().login(postparams);
            //   if (isVerfied) {
            //     Utils().showSnackBar("Login successful!", true);
            //     Get.toNamed(RoutePath.landing);
            //   } else {
            //     Utils().showSnackBar("Email ID or Password is incorrect.", false);
            //   }
            // }
          },
          bgclr: emailid.isNotEmpty && password.isNotEmpty ? clr.primaryColor : clr.disabledColor,
          textclr: clr.white,
          btnWidth: Screen.width(context),
        )
      ],
    );
  }
}
