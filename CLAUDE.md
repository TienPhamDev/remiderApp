# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Reminder App

## Mục tiêu
App nhắc việc đơn giản chạy trên iPhone và iPad, làm bằng Expo.

## Tech stack
- Expo (SDK mới nhất), TypeScript
- Expo Router để điều hướng
- expo-sqlite hoặc AsyncStorage để lưu dữ liệu local
- expo-notifications cho thông báo cục bộ
- @react-native-community/datetimepicker để chọn ngày giờ

## Quy tắc
- Code đơn giản, dễ đọc, có comment ngắn
- Mỗi màn hình / component một file riêng
- Không thêm thư viện ngoài danh sách trên nếu chưa hỏi tôi
- Trước khi dùng API của Expo, kiểm tra docs.expo.dev vì API thay đổi theo SDK
- Sau mỗi thay đổi, chạy `npx tsc --noEmit` để kiểm tra lỗi kiểu
- Giao diện phải dùng tốt trên cả iPhone và iPad (màn hình rộng)

## Tính năng
1. Thêm / sửa / xóa nhắc việc (tiêu đề, ghi chú, ngày giờ)
2. Thông báo đúng giờ
3. Đánh dấu hoàn thành
4. Dữ liệu lưu trên máy, còn sau khi tắt app

## Cách chạy
- `npx expo start`, rồi quét mã QR bằng Camera trên iPhone để mở bằng Expo Go
