import 'dart:developer';

import 'package:get/get.dart';
import 'package:sample_app_test1/constants/app_variables.dart';

class HomeController extends GetxController {
  RxInt currentIndex = 0.obs;
  RxList productList = [].obs;
  RxList cartList = [].obs;

  filterProducts(String name) {
    productList.value = AppVaiables.productsList.where((e) => e['product_name'].toString().toLowerCase().contains(name.toString().toLowerCase())).toList();
  }

  cartAddFunction(int productId) {
    List requestData = cartList.where((e) => e['product_id'] == productId).toList();
    if (requestData.isNotEmpty) {
      dynamic temp = requestData[0];
      temp['count'] = temp['count'] + 1;
      cartList.removeWhere((e) => e['product_id'] == productId);
      cartList.add(temp);
    } else {
      cartList.add({
        'product_id': productId,
        'count': 1,
      });
    }
  }

  cartreduceItemFunction(int productId) {
    List requestData = cartList.where((e) => e['product_id'] == productId).toList();
    if (requestData.isNotEmpty) {
      dynamic temp = requestData[0];
      temp['count'] = temp['count'] - 1;
      cartList.removeWhere((e) => e['product_id'] == productId);
      if (temp['count'] > 0) {
        cartList.add(temp);
      }
    }
  }
}
