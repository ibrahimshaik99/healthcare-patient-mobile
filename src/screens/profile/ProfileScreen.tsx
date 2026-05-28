import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Avatar} from '../../components/common/Avatar';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {useAuth} from '../../hooks/useAuth';
import {ProfileStackParamList} from '../../navigation/ProfileStack';

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

interface SettingsItem {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  color?: string;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const insets = useSafeAreaInsets();
  const {user, signOut} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: signOut},
      ],
    );
  };

  const personalInfo: SettingsItem[] = [
    {icon: 'calendar-outline', label: 'Date of Birth', value: user?.dateOfBirth || 'Not set'},
    {icon: 'person-outline', label: 'Gender', value: user?.gender || 'Not set'},
    {icon: 'water-outline', label: 'Blood Group', value: user?.bloodGroup || 'Not set'},
  ];

  const medicalInfo: SettingsItem[] = [
    {icon: 'alert-circle-outline', label: 'Allergies', value: user?.allergies?.join(', ') || 'None'},
    {icon: 'heart-outline', label: 'Chronic Diseases', value: user?.chronicDiseases?.join(', ') || 'None'},
  ];

  const emergencyInfo: SettingsItem[] = [
    {icon: 'call-outline', label: 'Emergency Contact', value: user?.emergencyContact?.phone || 'Not set'},
    {icon: 'person-outline', label: 'Contact Name', value: user?.emergencyContact?.name || 'Not set'},
  ];

  const settingsItems: SettingsItem[] = [
    {icon: 'notifications-outline', label: 'Notifications', value: 'On'},
    {icon: 'moon-outline', label: 'Dark Mode', value: 'Off'},
    {icon: 'language-outline', label: 'Language', value: 'English'},
  ];

  const renderSettingsRow = (item: SettingsItem, index: number) => (
    <TouchableOpacity key={index} style={styles.settingsRow} onPress={item.onPress}>
      <View style={styles.settingsLeft}>
        <Icon name={item.icon} size={20} color={item.color || Colors.textSecondary} />
        <Text style={styles.settingsLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingsRight}>
        {item.value && <Text style={styles.settingsValue}>{item.value}</Text>}
        <Icon name="chevron-forward" size={18} color={Colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: SettingsItem[]) => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => renderSettingsRow(item, index))}
    </Card>
  );

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Patient';
  const userEmail = user?.email || '';
  const userPhone = user?.phone || '';

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <Avatar source={user?.photo} name={fullName} size={88} showEdit />
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <View style={styles.contactRow}>
            <Icon name="mail-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.contactText}>{userEmail}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="call-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.contactText}>{userPhone}</Text>
          </View>
        </View>

        {renderSection('Personal Information', personalInfo)}
        {renderSection('Medical Information', medicalInfo)}
        {renderSection('Emergency Contact', emergencyInfo)}

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsItems.map((item, index) => renderSettingsRow(item, index))}
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Icon name="help-circle-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingsLabel}>Help & Support</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Icon name="document-text-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingsLabel}>Terms & Conditions</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('ChangePassword')}>
            <View style={styles.settingsLeft}>
              <Icon name="lock-closed-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.settingsLabel}>Change Password</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="medium"
            style={styles.logoutButton}
            textStyle={{color: Colors.error}}
            icon={<Icon name="log-out-outline" size={18} color={Colors.error} />}
          />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  editProfileBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryBg,
  },
  editProfileText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  userName: {
    ...Typography.h2,
    color: Colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  contactText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  sectionCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  settingsLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  settingsValue: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
  logoutSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    paddingBottom: Spacing.xxxxl,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});
