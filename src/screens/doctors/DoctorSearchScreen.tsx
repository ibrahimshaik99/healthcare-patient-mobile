import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {SearchBar} from '../../components/common/SearchBar';
import {DoctorCard} from '../../components/common/DoctorCard';
import {FilterModal} from '../../components/common/FilterModal';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {useDoctors} from '../../hooks/useDoctors';
import {DoctorFilters} from '../../types';
import {SPECIALIZATIONS} from '../../constants/departments';
import {DoctorStackParamList} from '../../navigation/DoctorStack';

type DoctorSearchNavProp = NativeStackNavigationProp<DoctorStackParamList, 'DoctorList'>;

const filterSections = [
  {
    title: 'Specialization',
    key: 'specialization',
    options: SPECIALIZATIONS.map(s => ({label: s, value: s})),
  },
  {
    title: 'Experience',
    key: 'experienceMin',
    options: [
      {label: '0-5 years', value: '0'},
      {label: '5-10 years', value: '5'},
      {label: '10-15 years', value: '10'},
      {label: '15+ years', value: '15'},
    ],
  },
  {
    title: 'Consultation Fee',
    key: 'feeMax',
    options: [
      {label: 'Under ₹500', value: '500'},
      {label: '₹500 - ₹1000', value: '1000'},
      {label: '₹1000 - ₹2000', value: '2000'},
      {label: 'Above ₹2000', value: '99999'},
    ],
  },
  {
    title: 'Rating',
    key: 'ratingMin',
    options: [
      {label: '4.5+', value: '4.5'},
      {label: '4.0+', value: '4.0'},
      {label: '3.5+', value: '3.5'},
      {label: '3.0+', value: '3.0'},
    ],
  },
];

export const DoctorSearchScreen: React.FC = () => {
  const navigation = useNavigation<DoctorSearchNavProp>();
  const insets = useSafeAreaInsets();
  const {doctors, isLoading, error, searchDoctors, getNearby} = useDoctors();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fees'>('rating');

  useEffect(() => {
    searchDoctors({sortBy, sortOrder: 'desc'});
  }, []);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      searchDoctors({search: text, sortBy, sortOrder: 'desc', ...activeFilters});
    },
    [sortBy, activeFilters, searchDoctors],
  );

  const handleApplyFilters = useCallback(
    (filters: Record<string, any>) => {
      setActiveFilters(filters);
      searchDoctors({...filters, search: searchQuery, sortBy, sortOrder: 'desc'});
    },
    [searchQuery, sortBy, searchDoctors],
  );

  const handleResetFilters = useCallback(() => {
    setActiveFilters({});
    searchDoctors({search: searchQuery, sortBy, sortOrder: 'desc'});
  }, [searchQuery, sortBy, searchDoctors]);

  const handleSort = (sort: 'rating' | 'experience' | 'fees') => {
    setSortBy(sort);
    searchDoctors({search: searchQuery, sortBy: sort, sortOrder: 'desc', ...activeFilters});
  };

  const activeFilterCount = Object.keys(activeFilters).filter(k => activeFilters[k]).length;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Find Doctors" showBack />

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by name, specialization..."
        onFilterPress={() => setShowFilters(true)}
      />

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['rating', 'experience', 'fees'] as const).map(sort => (
          <TouchableOpacity
            key={sort}
            style={[styles.sortChip, sortBy === sort && styles.sortChipActive]}
            onPress={() => handleSort(sort)}>
            <Text style={[styles.sortChipText, sortBy === sort && styles.sortChipTextActive]}>
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        {activeFilterCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </View>

      {isLoading && doctors.length === 0 ? (
        <Loader />
      ) : error ? (
        <EmptyState icon="alert-circle-outline" title="Error" message={error} actionLabel="Retry" onAction={() => searchDoctors({})} />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DoctorCard
              doctor={item}
              onPress={() => navigation.navigate('DoctorProfile', {doctorId: item.id})}
              showFees
              showDistance
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="search-outline" title="No Doctors Found" message="Try adjusting your search or filters" />
          }
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        sections={filterSections}
        currentFilters={activeFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  sortLabel: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  sortChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  sortChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: Colors.primary,
  },
  filterBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxxl,
  },
});
