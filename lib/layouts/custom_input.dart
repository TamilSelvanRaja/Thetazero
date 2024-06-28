import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/layouts/ui_helper.dart';

//*******************************************************/
//********* Input Field Class with Validation********/
//*******************************************************/
class CustomInput extends StatefulWidget {
  final String lableText;
  final String hintText;
  final String fieldname;
  final String fieldType;
  final dynamic validating;

  const CustomInput({super.key, required this.hintText, required this.lableText, required this.fieldname, required this.validating, required this.fieldType});
  @override
  State<CustomInput> createState() => _CustomInputState();
}

class _CustomInputState extends State<CustomInput> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        UiHelper.textStyle(widget.lableText, 16, isBold: true, color: clr.secondaryColor),
        UiHelper.verticalSpaceSmall,
        FormBuilderTextField(
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: clr.black),
          name: widget.fieldname,
          autocorrect: false,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          onChanged: (value) {},
          decoration: InputDecoration(
            hintText: widget.hintText,
            hintStyle: const TextStyle(fontSize: 14, color: clr.grey02),
            contentPadding: const EdgeInsets.symmetric(
              vertical: 0,
              horizontal: 15,
            ),
            enabledBorder: UiHelper.getInputBorder(2, borderColor: clr.grey01),
            focusedBorder: UiHelper.getInputBorder(2, borderColor: clr.grey01),
            errorBorder: UiHelper.getInputBorder(2, borderColor: clr.red),
            focusedErrorBorder: UiHelper.getInputBorder(2, borderColor: clr.red),
          ),
          keyboardType: TextInputType.text,
          validator: widget.validating,
        ),
      ],
    );
  }
}
