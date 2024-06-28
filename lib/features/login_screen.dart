import 'package:flutter/material.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/constants/strings.dart' as str;
import 'package:promilo/layouts/custom_input.dart';
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';

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
                UiHelper.textStyle(str.appname, 23, isBold: true),
                UiHelper.verticalSpaceMedium,
                UiHelper.textStyle(str.welcomeText, 20, isBold: true),
                UiHelper.verticalSpaceMedium,
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
                  children: [const Spacer(), UiHelper.textStyle(str.signinotp, 15, color: clr.primaryColor, isBold: true)],
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
                    UiHelper.textStyle(str.forgetpass, 15, color: clr.primaryColor, isBold: true)
                  ],
                ),
                UiHelper.verticalSpaceMedium,
                // DefaultButton(
                //         text: "Continue",
                //         press: () async {
                //           if (mobilecontroller.text.isEmpty) {
                //             getSnackBar("Mobile Number is Required", "W");
                //           } else if (passcontroller.text.isEmpty) {
                //             getSnackBar("Password is Required", "W");
                //           } else {
                //             usercontroller.isLoading.value = true;
                //             final res = await usercontroller.login(mobilecontroller.text, passcontroller.text);
                //             usercontroller.isLoading.value = false;
                //             if (res["msg"]) {
                //               onSuccess(res['user']);
                //             } else {
                //               getSnackBar("Phone number or Password is wrong", "E");
                //             }
                //           }
                //         },
                //       ),
                UiHelper.verticalSpaceMedium,
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    UiHelper.textStyle("Don’t have an account? ", 14),
                    GestureDetector(
                      onTap: () {
                        //   Get.to(() => const VerifyNumberView(title: "Signup"));
                      },
                      child: UiHelper.textStyle("Sign up", 14, color: clr.primaryColor),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
