import 'dart:async';
import 'dart:convert';

import 'package:dio/dio.dart';
// ignore: implementation_imports
import 'package:dio/src/form_data.dart' as formdata1;
import 'package:flutter/widgets.dart';

class ApiService {
  Dio client = Dio();
  String apiEndPoint = "https://apiv2stg.promilo.com/user/oauth/token";
  var encodingType = Encoding.getByName('utf-8');
  var headerType = {
    'Authorization': 'Basic UHJvbWlsbzpxNCE1NkBaeSN4MiRHQg==',
  };

  // ******************************************************** \\
  // ******************* Login API Functions ***************** \\
  // ******************************************************** \\
  Future<bool> login(Map<String, dynamic> postdata) async {
    try {
      var formData = formdata1.FormData.fromMap(postdata);
      var response = await client.post(
        apiEndPoint,
        data: formData,
        options: Options(
          headers: headerType,
        ),
      );
      debugPrint("response : $response");
      return true;
    } catch (e) {
      debugPrint(e.toString());
    }
    return false;
  }
}
