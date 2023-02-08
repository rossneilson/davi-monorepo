import { Header as CardHeader } from 'components/Card';
import { OptionsList } from './OptionsList';
import { EditButton } from './common';
import { Option } from './types';
import { bulkEncodeCallsFromOptions } from 'hooks/Guilds/contracts/useEncodedCall';
import { AddEditOptionModal } from './AddEditOptionModal';
import { SidebarCard, SidebarCardHeaderSpaced } from 'components/SidebarCard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ActionsBuilderProps {
  options: Option[];
  editable?: boolean;
  onChange?: (options: Option[]) => void;
}
export const ActionsBuilder: React.FC<ActionsBuilderProps> = ({
  editable,
  options,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isEditable, setIsEditable] = useState(editable);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editableOption, setEditableOption] = useState(null);
  const [encodedOptions, setEncodedOptions] = useState<Option[]>([]);
  const onEdit = () => setIsEditable(true);
  const onSave = () => setIsEditable(false);

  useEffect(() => {
    const encodedOptions = bulkEncodeCallsFromOptions(options);
    setEncodedOptions(encodedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <SidebarCard
      header={
        <SidebarCardHeaderSpaced>
          <CardHeader>{t('actionBuidler.action.actions_other')}</CardHeader>
          {editable && (
            <EditButton
              variant="secondary"
              onClick={() => (isEditable ? onSave() : onEdit())}
            >
              {isEditable
                ? t('actionBuilder.save')
                : t('actionBuilder.action.edit')}
            </EditButton>
          )}
        </SidebarCardHeaderSpaced>
      }
    >
      <OptionsList
        isEditable={isEditable}
        options={encodedOptions ? encodedOptions : options}
        onChange={onChange}
        addOption={() => setShowAddModal(true)}
        editOption={option => {
          setEditableOption(option);
          setShowAddModal(true);
        }}
      />
      {showAddModal && (
        <AddEditOptionModal
          editableOption={editableOption}
          options={encodedOptions ? encodedOptions : options}
          onDismiss={() => {
            setEditableOption(null);
            setShowAddModal(false);
          }}
          onChange={onChange}
        />
      )}
    </SidebarCard>
  );
};
