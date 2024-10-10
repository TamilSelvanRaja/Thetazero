import 'package:get/get.dart';
import 'package:sample_app_test1/constants/app_variables.dart';

class HomeController extends GetxController {
  RxInt currentIndex = 0.obs;
  RxList productList = [].obs;
  RxList cartList = [].obs;
  RxInt total = 0.obs;
  filterProducts(String name) {
    productList.value = AppVaiables.productsList.where((e) => e['product_name'].toString().toLowerCase().contains(name.toString().toLowerCase())).toList();
  }

  cartAddFunction(int productId) {
    total.value = 0;
    List requestData = cartList.where((e) => e['product_id'] == productId).toList();
    if (requestData.isNotEmpty) {
      dynamic temp = requestData[0];
      temp['count'] = temp['count'] + 1;
      for (int i = 0; i < cartList.length; i++) {
        if (cartList[i]['product_id'] == productId) {
          cartList[i]['count'] = temp['count'];
        }
      }
    } else {
      cartList.add({
        'product_id': productId,
        'count': 1,
      });
    }
    totalCalculation();
  }

  cartFunction(int productId, int count) {
    total.value = 0;
    dynamic temp = {'product_id': productId, 'count': count};
    cartList.removeWhere((e) => e['product_id'] == productId);
    cartList.add(temp);
    totalCalculation();
  }

  cartreduceItemFunction(int productId) {
    total.value = 0;
    List requestData = cartList.where((e) => e['product_id'] == productId).toList();
    if (requestData.isNotEmpty) {
      dynamic temp = requestData[0];
      temp['count'] = temp['count'] - 1;
      for (int i = 0; i < cartList.length; i++) {
        if (cartList[i]['product_id'] == productId) {
          if (temp['count'] > 0) {
            cartList[i]['count'] = temp['count'];
          } else {
            cartList.removeWhere((e) => e['product_id'] == productId);
          }
        }
      }
    }
    totalCalculation();
  }

  getProductDetails(int id) {
    List tempList = AppVaiables.productsList.where((e) => e['product_id'] == id).toList();
    return tempList;
  }

  totalCalculation() {
    total.value = 0;
    for (var i in cartList) {
      dynamic productdata = getProductDetails(i['product_id'])[0];
      int temp = productdata['product_price'] * i['count'];
      total.value = total.value + temp;
    }
  }
}
