import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/layouts/ui_helper.dart';

class Utils {
  ///******** Email Validation Regular Expression **********///
  bool isEmailValid(value) {
    return RegExp(
      r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
    ).hasMatch(value);
  }

  ///******** Password Validation Regular Expression **********///
  bool isPasswordValid(value) {
    return RegExp(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#%^&+=]).{8,}$").hasMatch(value);
  }

  ///******** String convert to SHA256 KEY **********///
  String sha256Hash(String pass) {
    var bytes = utf8.encode(pass);
    var digest = sha256.convert(bytes);
    return digest.toString();
  }

  ///******** Snack Bar Alert **********///
  SnackbarController showSnackBar(String message, bool isSuccess) {
    return Get.snackbar(
      "",
      "",
      snackPosition: SnackPosition.TOP,
      duration: const Duration(seconds: 2),
      backgroundColor: isSuccess ? clr.green : clr.red,
      margin: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
      colorText: clr.white,
      messageText: UiHelper.customText(message, 18, color: clr.white),
      titleText: UiHelper.customText(isSuccess ? "Success" : "Failure", 18, color: clr.white, isBold: true, isCenterAlignment: true),
    );
  }
}
