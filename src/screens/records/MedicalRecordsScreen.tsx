import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Colors, Typography, Spacing, BorderRadius, Shadows} from '../../constants/theme';
import {Header} from '../../components/common/Header';
import {Button} from '../../components/common/Button';
import {EmptyState} from '../../components/common/EmptyState';
import {RecordStackParamList} from '../../navigation/RecordStack';

type RecordsNavProp = NativeStackNavigationProp<RecordStackParamList, 'MedicalRecords'>;

type RecordTab = 'all' | 'reports' | 'prescriptions' | 'lab';

interface MedicalFile {
  id: string;
  name: string;
  type: 'report' | 'prescription' | 'lab';
  date: string;
  fileSize?: string;
  doctorName?: string;
}

const sampleFiles: MedicalFile[] = [
  {
    id: '1',
    name: 'Blood Test Report',
    type: 'lab',
    date: '2026-05-20',
    fileSize: '2.3 MB',
    doctorName: 'Dr. Priya Sharma',
  },
  {
    id: '2',
    name: 'Chest X-Ray',
    type: 'report',
    date: '2026-05-18',
    fileSize: '5.1 MB',
    doctorName: 'Dr. Rahul Verma',
  },
  {
    id: '3',
    name: 'General Checkup Prescription',
    type: 'prescription',
    date: '2026-05-15',
    doctorName: 'Dr. Anita Patel',
  },
];

const tabs: {key: RecordTab; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'reports', label: 'Reports'},
  {key: 'prescriptions', label: 'Prescriptions'},
  {key: 'lab', label: 'Lab Results'},
];

export const MedicalRecordsScreen: React.FC = () => {
  const navigation = useNavigation<RecordsNavProp>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecordTab>('all');
  const [files, setFiles] = useState<MedicalFile[]>(sampleFiles);

  const filteredFiles = activeTab === 'all' ? files : files.filter(f => f.type === activeTab);

  const handleUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
      });
      if (result.assets && result.assets[0]) {
        Alert.alert('Upload', 'File selected. Upload functionality will be implemented.');
      }
    } catch {
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const getFileIcon = (type: string): string => {
    switch (type) {
      case 'report': return 'document-text-outline';
      case 'prescription': return 'medkit-outline';
      case 'lab': return 'flask-outline';
      default: return 'document-outline';
    }
  };

  const getFileColor = (type: string): string => {
    switch (type) {
      case 'report': return Colors.primary;
      case 'prescription': return Colors.secondary;
      case 'lab': return '#8B5CF6';
      default: return Colors.textTertiary;
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <Header title="Medical Records" rightAction={
        <TouchableOpacity onPress={handleUpload} style={styles.uploadBtn}>
          <Icon name="cloud-upload-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      } />

      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredFiles}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.fileCard} activeOpacity={0.7}>
            <View style={[styles.fileIconBg, {backgroundColor: getFileColor(item.type) + '15'}]}>
              <Icon name={getFileIcon(item.type)} size={28} color={getFileColor(item.type)} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item.name}</Text>
              <Text style={styles.fileDate}>{item.date}</Text>
              {item.doctorName && <Text style={styles.fileDoctor}>{item.doctorName}</Text>}
              {item.fileSize && <Text style={styles.fileSize}>{item.fileSize}</Text>}
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Icon name="download-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="No Records Found"
            message="Upload your medical reports and prescriptions"
            actionLabel="Upload Record"
            onAction={handleUpload}
          />
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={handleUpload}>
          <Icon name="cloud-upload" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  uploadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.borderLight,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.white,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  fileIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  fileName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  fileDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  fileDoctor: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  fileSize: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxxl,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.xxl,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});
