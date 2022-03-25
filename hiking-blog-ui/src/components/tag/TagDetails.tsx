import React, { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { getTag, addTag } from '../../services/tagApi';

import { Tag } from '../../data/tag';
import { EditType } from '../../data/editType';

interface TagDetailsProps {
  tagId: number;
  editType: EditType;
  postSaveTag: () => void;
}

const TagDetails = (props: TagDetailsProps) => {
  const {tagId, editType, postSaveTag} = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editType !== EditType.UPDATE) {
      return;
    }
    let didCancel = false;
    const _getTag = async () => {
      const tag = await getTag(tagId);
      if (tag) {
        if (!didCancel) {
          setName(tag.name);
          setDescription(tag.description);
        }
      }
    };
    _getTag();
    return () => {didCancel = true;};
  }, [tagId, setName, setDescription]);

  const updateName = useCallback((event) => {
    setName(event.target.value);
  }, [setName]);

  const updateDescription = useCallback((event) => {
    setDescription(event.target.value);
  }, [setDescription]);

  const validate = useCallback(() => {
    return name.trim().length > 0;
  }, [name]);

  const save = async () => {
    if (!validate()) {
      console.log('invalid tag details to save');
      return;
    }
    let res: number;
    if (editType === EditType.ADD) {
      res = await addTag(name, description);
    } else {
      // TODO
      res = 1;
    }
    if (res >= 0) {
      console.log('saved tag');
      alert(`Saved tag ${name}`);
      postSaveTag();
    } else {
      console.log('cannot save tag');
      alert(`Cannot save tag ${name}`);
    }
  };

  return (
    <div>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={updateName}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={updateDescription}
      />
      <Button variant="contained" onClick={save}>Save</Button>
    </div>
  );
};

export default TagDetails;
