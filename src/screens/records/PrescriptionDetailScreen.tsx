import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Button} from '../../components/common/Button';
import {Card} from '../../components/common/Card';

const samplePrescription = {
  id: 'P123456',
  doctorName: 'Dr. Priya Sharma',
  specialization: 'Cardiologist',
  qualification: 'MD, DM (Cardiology)',
  patientName: 'John Doe',
  date: '2026-05-20',
  diagnosis: 'Mild hypertension with elevated cholesterol levels. Patient presents with occasional headaches and fatigue.',
  medicines: [
    {name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'Take after breakfast', beforeFood: false},
    {name: 'Atorvastatin 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'Take at bedtime', beforeFood: false},
    {name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily', duration: '90 days', instructions: 'Take after lunch', beforeFood: false},
  ],
  tests: [
    {name: 'Lipid Profile', instructions: '12 hour fasting required'},
    {name: 'ECG', instructions: 'No special preparation'},
    {name: 'Blood Sugar (Fasting)', instructions: '8 hour fasting required'},
  ],
  notes: 'Follow up in 2 weeks. Maintain low salt diet. Regular exercise 30 mins daily.',
};

export const PrescriptionDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Prescription" showBack rightAction={
        <TouchableOpacity style={styles.downloadBtn}>
          <Icon name="download-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      } />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="medkit" size={32} color={Colors.white} />
          </View>
          <Text style={styles.headerTitle}>Prescription</Text>
          <Text style={styles.headerId}>#{samplePrescription.id}</Text>
          <Text style={styles.headerDate}>{samplePrescription.date}</Text>
        </View>

        <Card style={styles.doctorCard}>
          <View style={styles.doctorCardContent}>
            <View style={styles.doctorAvatar}>
              <Icon name="person-circle" size={48} color={Colors.primary} />
            </View>
            <View style={styles.doctorCardInfo}>
              <Text style={styles.doctorName}>{samplePrescription.doctorName}</Text>
              <Text style={styles.doctorSpec}>{samplePrescription.specialization}</Text>
              <Text style={styles.doctorQual}>{samplePrescription.qualification}</Text>
            </View>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientLabel}>Patient: <Text style={styles.patientValue}>{samplePrescription.patientName}</Text></Text>
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="clipboard-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Diagnosis</Text>
          </View>
          <Text style={styles.diagnosisText}>{samplePrescription.diagnosis}</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="medical-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Medicines</Text>
          </View>
          {samplePrescription.medicines.map((med, index) => (
            <View key={index} style={styles.medicineItem}>
              <View style={styles.medicineDot} />
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{med.name}</Text>
                <Text style={styles.medicineDetail}>{med.dosage} • {med.frequency} • {med.duration}</Text>
                {med.instructions && (
                  <Text style={styles.medicineInstruction}>{med.instructions}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="flask-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Pathology Tests</Text>
          </View>
          {samplePrescription.tests.map((test, index) => (
            <View key={index} style={styles.testItem}>
              <View style={styles.testCheck}>
                <Icon name="checkbox-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testInstruction}>{test.instructions}</Text>
              </View>
            </View>
          ))}
        </Card>

        {samplePrescription.notes && (
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{samplePrescription.notes}</Text>
          </Card>
        )}

        <View style={styles.footer}>
          <Button
            title="Download PDF"
            onPress={() => {}}
            variant="primary"
            size="large"
            icon={<Icon name="download-outline" size={20} color={Colors.white} />}
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
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.white,
  },
  headerId: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  headerDate: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  doctorCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  doctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {},
  doctorCardInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  doctorName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  doctorSpec: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  doctorQual: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  patientInfo: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  patientLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  patientValue: {
    color: Colors.text,
    fontWeight: '500',
  },
  sectionCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  diagnosisText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  medicineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  medicineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  medicineDetail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  medicineInstruction: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  testItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  testCheck: {
    marginTop: 2,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  testInstruction: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notesText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
});
