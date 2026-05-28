import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Input} from '../../components/common/Input';
import {Button} from '../../components/common/Button';
import {Avatar} from '../../components/common/Avatar';
import {useAuth} from '../../hooks/useAuth';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {user, updateProfile} = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        dateOfBirth,
        gender: gender as any,
        bloodGroup,
        allergies: allergies ? allergies.split(',').map(s => s.trim()) : [],
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: 'family',
        },
        address: {
          street,
          city,
          state,
          zipCode,
          country: 'India',
        },
      } as any);
      navigation.goBack();
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = ['male', 'female', 'other'];
  const bloodOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header title="Edit Profile" showBack />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <Avatar
            source={user?.photo}
            name={`${firstName} ${lastName}`}
            size={100}
            showEdit
          />
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="First name" />
            </View>
            <View style={styles.halfField}>
              <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Last name" />
            </View>
          </View>

          <Input label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
          <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" />

          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.optionsRow}>
            {genderOptions.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.optionChip, gender === g && styles.optionChipActive]}
                onPress={() => setGender(g)}>
                <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Blood Group</Text>
          <View style={styles.optionsRow}>
            {bloodOptions.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.optionChip, bloodGroup === b && styles.optionChipActive]}
                onPress={() => setBloodGroup(b)}>
                <Text style={[styles.optionText, bloodGroup === b && styles.optionTextActive]}>
                  {b}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label="Allergies (comma separated)" value={allergies} onChangeText={setAllergies} placeholder="e.g., Penicillin, Pollen" />

          <Text style={styles.sectionHeader}>Emergency Contact</Text>
          <Input label="Contact Name" value={emergencyName} onChangeText={setEmergencyName} placeholder="Emergency contact name" />
          <Input label="Contact Phone" value={emergencyPhone} onChangeText={setEmergencyPhone} placeholder="Emergency contact phone" keyboardType="phone-pad" />

          <Text style={styles.sectionHeader}>Address</Text>
          <Input label="Street" value={street} onChangeText={setStreet} placeholder="Street address" />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input label="City" value={city} onChangeText={setCity} placeholder="City" />
            </View>
            <View style={styles.halfField}>
              <Input label="State" value={state} onChangeText={setState} placeholder="State" />
            </View>
          </View>
          <Input label="Zip Code" value={zipCode} onChangeText={setZipCode} placeholder="Zip code" keyboardType="number-pad" />

          <View style={styles.footer}>
            <Button title="Save Changes" onPress={handleSave} loading={isLoading} variant="primary" size="large" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  form: {
    paddingHorizontal: Spacing.xl,
  },
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  optionChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  optionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.primary,
  },
  sectionHeader: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  footer: {
    paddingVertical: Spacing.xxl,
    paddingBottom: Spacing.xxxxl,
  },
});
