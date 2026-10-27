import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { CategoryRow } from '../../components/CategoryRow';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import { Icon } from '../../components/Icon';
import { useTasks } from '../../context/TasksContext';
import { colors, maxContentWidth, radius, spacing, typography } from '../../theme';
import { Category } from '../../types/category';

// Tab Category: quản lý danh mục (thêm, sửa tên, xóa) và xem số việc đã xong / tổng của từng danh mục
export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tasks, categories, removeCategory } = useTasks();
  const [deleting, setDeleting] = useState<Category | null>(null);

  // Danh mục còn lại nhận các việc của danh mục bị xóa
  const fallback = categories.find((c) => c.id !== deleting?.id);

  const askDelete = (category: Category) => {
    if (categories.length <= 1) {
      Alert.alert('Cannot delete', 'You need at least one category.');
      return;
    }
    setDeleting(category);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const id = deleting.id;
    setDeleting(null);
    await removeCategory(id);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <AppHeader title="Category" />
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Categories display on homepage</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Nội dung căn giữa, giới hạn bề rộng để đẹp trên iPad */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Manage Categories</Text>

          <View style={styles.list}>
            {categories.map((category) => {
              const inCategory = tasks.filter((t) => t.category === category.name);
              return (
                <CategoryRow
                  key={category.id}
                  category={category}
                  doneCount={inCategory.filter((t) => t.done).length}
                  totalCount={inCategory.length}
                  onEdit={(c) => router.push({ pathname: '/category-form', params: { id: String(c.id) } })}
                  onDelete={askDelete}
                />
              );
            })}

            <Pressable style={styles.create} onPress={() => router.push('/category-form')}>
              <Icon name="add" color={colors.textMuted} />
              <Text style={styles.createText}>Create new category</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ConfirmDeleteModal
        visible={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
        message={`Do you really want to delete "${deleting?.name ?? ''}"?\nIts tasks will be moved to "${fallback?.name ?? ''}".`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  banner: { paddingVertical: 12, alignItems: 'center', backgroundColor: colors.actionBar },
  bannerText: { ...typography.caption, color: colors.textMuted },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl + spacing.lg },
  content: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', gap: spacing.md },
  sectionTitle: { ...typography.section, color: colors.text },
  list: { gap: spacing.sm },
  create: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  createText: { ...typography.body, color: colors.textMuted },
});
