import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {SearchBar} from '../../components/common/SearchBar';
import {DoctorCard} from '../../components/common/DoctorCard';
import {SkeletonLoader} from '../../components/common/SkeletonLoader';
import {useDoctors} from '../../hooks/useDoctors';
import {useAuth} from '../../hooks/useAuth';
import {DEPARTMENTS} from '../../constants/departments';
import {HomeStackParamList} from '../../navigation/HomeStack';
import {Doctor} from '../../types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.xxl * 2;
const CARD_WIDTH = 200;

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const banners = [
  {
    id: '1',
    title: 'Consult Top Doctors',
    subtitle: 'Online or in-clinic',
    color: Colors.primary,
    icon: 'videocam',
  },
  {
    id: '2',
    title: 'Health Checkups',
    subtitle: 'Book lab tests at home',
    color: Colors.secondary,
    icon: 'flask',
  },
  {
    id: '3',
    title: 'Medicine Delivery',
    subtitle: 'Order medicines online',
    color: '#8B5CF6',
    icon: 'medkit',
  },
];

const quickActions = [
  {
    id: 'online',
    title: 'Online\nConsultation',
    icon: 'videocam-outline',
    color: Colors.primary,
    bgColor: Colors.primaryBg,
  },
  {
    id: 'opd',
    title: 'OPD\nConsultation',
    icon: 'business-outline',
    color: Colors.secondary,
    bgColor: Colors.secondaryBg,
  },
  {
    id: 'lab',
    title: 'Lab\nTests',
    icon: 'flask-outline',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
  {
    id: 'medicine',
    title: 'Order\nMedicine',
    icon: 'medkit-outline',
    color: '#F97316',
    bgColor: '#FFF7ED',
  },
];

const popularDoctors: Doctor[] = [
  {
    id: '1',
    userId: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    specializations: ['Cardiologist'],
    qualifications: [{degree: 'MD', institution: 'AIIMS', year: 2010}],
    experience: 15,
    certifications: [],
    about: '',
    rating: 4.8,
    reviewCount: 120,
    consultationFee: 800,
    onlineFee: 600,
    isAvailable: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    userId: '2',
    firstName: 'Rahul',
    lastName: 'Verma',
    specializations: ['Dermatologist'],
    qualifications: [{degree: 'MD', institution: 'MAMC', year: 2012}],
    experience: 12,
    certifications: [],
    about: '',
    rating: 4.6,
    reviewCount: 95,
    consultationFee: 600,
    onlineFee: 500,
    isAvailable: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    userId: '3',
    firstName: 'Anita',
    lastName: 'Patel',
    specializations: ['Neurologist'],
    qualifications: [{degree: 'DM', institution: 'PGI', year: 2008}],
    experience: 16,
    certifications: [],
    about: '',
    rating: 4.9,
    reviewCount: 200,
    consultationFee: 1200,
    onlineFee: 900,
    isAvailable: false,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    userId: '4',
    firstName: 'Suresh',
    lastName: 'Reddy',
    specializations: ['Pediatrician'],
    qualifications: [{degree: 'MD', institution: 'CMC', year: 2014}],
    experience: 10,
    certifications: [],
    about: '',
    rating: 4.5,
    reviewCount: 78,
    consultationFee: 500,
    onlineFee: 400,
    isAvailable: true,
    availability: [],
    createdAt: '',
    updatedAt: '',
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const {doctors, isLoading, searchDoctors} = useDoctors();

  const [activeBanner, setActiveBanner] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    searchDoctors({sortBy: 'rating', sortOrder: 'desc'});
  }, []);

  const onBannerScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
      setActiveBanner(index);
    },
    [],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await searchDoctors({sortBy: 'rating', sortOrder: 'desc'});
    setRefreshing(false);
  }, [searchDoctors]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || 'Patient'}
          </Text>
          <Text style={styles.headerSubtitle}>Find your healthcare needs</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Icon name="notifications-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }>
        <SearchBar
          value=""
          onChangeText={() => {}}
          onFocus={() => navigation.navigate('DoctorSearch')}
          editable={false}
          placeholder="Search doctors, clinics..."
        />

        <View style={styles.bannerSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.bannerScroll}>
            {banners.map(banner => (
              <TouchableOpacity
                key={banner.id}
                style={[styles.bannerCard, {backgroundColor: banner.color}]}
                activeOpacity={0.9}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
                <Icon name={banner.icon} size={80} color="rgba(255,255,255,0.2)" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeBanner && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.7}>
                <View style={[styles.quickActionIcon, {backgroundColor: action.bgColor}]}>
                  <Icon name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Departments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.departmentsScroll}>
            {DEPARTMENTS.map(dept => (
              <TouchableOpacity key={dept.id} style={styles.departmentItem} activeOpacity={0.7}>
                <View style={[styles.departmentIcon, {backgroundColor: dept.color + '15'}]}>
                  <Icon name="medical" size={24} color={dept.color} />
                </View>
                <Text style={styles.departmentName}>{dept.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Doctors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorSearch')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorsScroll}>
            {isLoading ? (
              <SkeletonLoader type="doctor" count={3} />
            ) : (
              popularDoctors.map(doctor => (
                <TouchableOpacity
                  key={doctor.id}
                  onPress={() => navigation.navigate('DoctorProfile', {doctorId: doctor.id})}
                  activeOpacity={0.7}>
                  <DoctorCard doctor={doctor} horizontal showFees />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.consultationCards}>
            <TouchableOpacity style={styles.consultCard} activeOpacity={0.7}>
              <View style={[styles.consultIconBg, {backgroundColor: Colors.primaryBg}]}>
                <Icon name="videocam" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.consultTitle}>Online Consultation</Text>
              <Text style={styles.consultDesc}>Video call with top doctors</Text>
              <View style={styles.consultAction}>
                <Text style={styles.consultActionText}>Consult Now</Text>
                <Icon name="arrow-forward" size={16} color={Colors.primary} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.consultCard} activeOpacity={0.7}>
              <View style={[styles.consultIconBg, {backgroundColor: Colors.secondaryBg}]}>
                <Icon name="business" size={28} color={Colors.secondary} />
              </View>
              <Text style={styles.consultTitle}>OPD Consultation</Text>
              <Text style={styles.consultDesc}>Visit clinic in person</Text>
              <View style={styles.consultAction}>
                <Text style={styles.consultActionText}>Book OPD</Text>
                <Icon name="arrow-forward" size={16} color={Colors.secondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapPreview}>
            <Icon name="map-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.mapText}>Map View</Text>
          </View>
        </View>

        <View style={[styles.section, {marginBottom: Spacing.xxxxl}]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Doctors</Text>
          </View>
          {doctors.slice(0, 3).map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onPress={() => navigation.navigate('DoctorProfile', {doctorId: doctor.id})}
              showFees
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  greeting: {
    ...Typography.h3,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerSection: {
    marginTop: Spacing.sm,
  },
  bannerScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.h3,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.lg,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    ...Typography.buttonSmall,
    color: Colors.white,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  seeAll: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    ...Typography.caption,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  departmentsScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  departmentItem: {
    alignItems: 'center',
    width: 72,
  },
  departmentIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  departmentName: {
    ...Typography.caption,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  doctorsScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  consultationCards: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  consultCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  consultIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  consultTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  consultDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  consultAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  consultActionText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  mapPreview: {
    height: 160,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    ...Typography.body,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
});
