import 'package:flutter/material.dart';
import 'package:promilo/constants/image_paths.dart';

class OtherSignIn extends StatelessWidget {
  OtherSignIn({super.key});

  final List imageList = [gImage, inImage, fbImage, instaImage, whatsappImage];
  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(
            imageList.length,
            (index) => Container(
                height: 35,
                width: 35,
                margin: const EdgeInsets.all(5),
                child: Image.asset(imageList[index], fit: BoxFit.cover))));
  }
}
