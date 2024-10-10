import 'package:flutter/material.dart';

class SearchField extends StatelessWidget {
  const SearchField({super.key, required this.hintText, required this.onEnter});
  final Function onEnter;
  final String hintText;
  @override
  Widget build(BuildContext context) {
    return TextField(
      onChanged: (value) {
        onEnter(value);
      },
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: const TextStyle(color: Colors.black26),
        suffixIconConstraints: const BoxConstraints(minHeight: 20, minWidth: 20),
        contentPadding: const EdgeInsets.only(left: 15, right: 5, top: 5, bottom: 5),
        filled: true,
        fillColor: Colors.black.withOpacity(0.1),
        prefixIcon: const Padding(padding: EdgeInsets.all(3), child: Icon(Icons.search, size: 20, color: Colors.black)),
        enabledBorder: OutlineInputBorder(borderSide: BorderSide(width: 0, color: Colors.black.withOpacity(0.1)), borderRadius: const BorderRadius.all(Radius.circular(10))),
        disabledBorder: OutlineInputBorder(borderSide: BorderSide(width: 0, color: Colors.black.withOpacity(0.1)), borderRadius: const BorderRadius.all(Radius.circular(10))),
        focusedBorder: OutlineInputBorder(borderSide: BorderSide(width: 0, color: Colors.black.withOpacity(0.1)), borderRadius: const BorderRadius.all(Radius.circular(10))),
      ),
    );
  }
}
