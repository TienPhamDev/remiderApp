import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { useTasks } from '../context/TasksContext';
import { colors, fonts, radius, typography } from '../theme';

// Bottom sheet thêm danh mục mới, hoặc sửa tên khi có tham số id
export default function CategoryFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { categories, addCategory, renameCategory } = useTasks();
  const editing = id ? categories.find((c) => c.id === Number(id)) : undefined;
  const [name, setName] = useState(editing?.name ?? '');
  const [saving, setSaving] = useState(false);

  const trimmed = name.trim();
  // Không cho trùng tên với danh mục khác (không phân biệt hoa thường)
  const duplicate = categories.some((c) => c.id !== editing?.id && c.name.toLowerCase() === trimmed.toLowerCase());
  const canSave = trimmed.length > 0 && !duplicate && !saving;

  const submit = async () => {
    if (!canSave) return;
    setSaving(true);
    const ok = editing ? await renameCategory(editing.id, trimmed) : await addCategory(trimmed);
    if (ok) router.back();
    else setSaving(false); // lỗi lưu thì giữ sheet mở và cho bấm lại
  };

  return (
    <BottomSheet onClose={() => router.back()}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter Category name"
        placeholderTextColor={colors.placeholder}
        returnKeyType="done"
        onSubmitEditing={submit}
        maxLength={40}
        autoFocus
      />
      {duplicate && <Text style={styles.error}>This category already exists</Text>}
      <Pressable style={[styles.button, !canSave && styles.disabled]} onPress={submit} disabled={!canSave}>
        <Text style={styles.buttonText}>{editing ? 'Save Category' : 'Add New Category'}</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.caption,
    height: 56,
    paddingHorizontal: 18,
    borderRadius: radius.card,
    backgroundColor: colors.input,
    color: colors.text,
  },
  error: { ...typography.caption, color: colors.danger },
  button: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  disabled: { opacity: 0.5 },
  buttonText: { ...typography.body, fontFamily: fonts.medium, color: colors.text },
});
