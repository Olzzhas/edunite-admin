import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentService } from '../../services/api';

// Async thunks
export const fetchAssignmentGroups = createAsyncThunk(
  'assignments/fetchAssignmentGroups',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getAssignmentGroups(threadId);
      return { threadId, groups: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assignment groups');
    }
  }
);

export const fetchAssignmentGroupById = createAsyncThunk(
  'assignments/fetchAssignmentGroupById',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await assignmentService.getAssignmentGroupById(groupId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assignment group');
    }
  }
);

export const createAssignmentGroup = createAsyncThunk(
  'assignments/createAssignmentGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await assignmentService.createAssignmentGroup(groupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create assignment group');
    }
  }
);

export const updateAssignmentGroup = createAsyncThunk(
  'assignments/updateAssignmentGroup',
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const response = await assignmentService.updateAssignmentGroup(groupId, groupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update assignment group');
    }
  }
);

export const deleteAssignmentGroup = createAsyncThunk(
  'assignments/deleteAssignmentGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      await assignmentService.deleteAssignmentGroup(groupId);
      return groupId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete assignment group');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async ({ groupId, assignmentData }, { rejectWithValue }) => {
    try {
      const response = await assignmentService.createAssignment(groupId, assignmentData);
      return { groupId, assignment: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create assignment');
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/updateAssignment',
  async ({ assignmentId, assignmentData }, { rejectWithValue }) => {
    try {
      const response = await assignmentService.updateAssignment(assignmentId, assignmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update assignment');
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/deleteAssignment',
  async (assignmentId, { rejectWithValue }) => {
    try {
      await assignmentService.deleteAssignment(assignmentId);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete assignment');
    }
  }
);

export const addAttachment = createAsyncThunk(
  'assignments/addAttachment',
  async ({ assignmentId, file }, { rejectWithValue }) => {
    try {
      const response = await assignmentService.addAttachment(assignmentId, file);
      return { assignmentId, attachment: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add attachment');
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'assignments/deleteAttachment',
  async (attachmentId, { rejectWithValue }) => {
    try {
      await assignmentService.deleteAttachment(attachmentId);
      return attachmentId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete attachment');
    }
  }
);

// Initial state
const initialState = {
  assignmentGroups: {},
  selectedGroup: null,
  loading: false,
  error: null,
};

// Slice
const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedGroup: (state) => {
      state.selectedGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignment groups
      .addCase(fetchAssignmentGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentGroups.fulfilled, (state, action) => {
        state.loading = false;
        const { threadId, groups } = action.payload;
        state.assignmentGroups[threadId] = groups;
      })
      .addCase(fetchAssignmentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch assignment group by ID
      .addCase(fetchAssignmentGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGroup = action.payload;
      })
      .addCase(fetchAssignmentGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create assignment group
      .addCase(createAssignmentGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignmentGroup.fulfilled, (state, action) => {
        state.loading = false;
        const newGroup = action.payload;
        const threadId = newGroup.threadId;
        
        if (!state.assignmentGroups[threadId]) {
          state.assignmentGroups[threadId] = [];
        }
        
        state.assignmentGroups[threadId].push(newGroup);
      })
      .addCase(createAssignmentGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update assignment group
      .addCase(updateAssignmentGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentGroup.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGroup = action.payload;
        const threadId = updatedGroup.threadId;
        
        if (state.assignmentGroups[threadId]) {
          const groupIndex = state.assignmentGroups[threadId].findIndex(
            group => group.id === updatedGroup.id
          );
          
          if (groupIndex !== -1) {
            state.assignmentGroups[threadId][groupIndex] = updatedGroup;
          }
        }
        
        if (state.selectedGroup && state.selectedGroup.id === updatedGroup.id) {
          state.selectedGroup = updatedGroup;
        }
      })
      .addCase(updateAssignmentGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete assignment group
      .addCase(deleteAssignmentGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignmentGroup.fulfilled, (state, action) => {
        state.loading = false;
        const groupId = action.payload;
        
        // Find and remove the group from all thread groups
        for (const threadId in state.assignmentGroups) {
          state.assignmentGroups[threadId] = state.assignmentGroups[threadId].filter(
            group => group.id !== groupId
          );
        }
        
        if (state.selectedGroup && state.selectedGroup.id === groupId) {
          state.selectedGroup = null;
        }
      })
      .addCase(deleteAssignmentGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, assignment } = action.payload;
        
        // Find the group in all thread groups and add the assignment
        for (const threadId in state.assignmentGroups) {
          const groupIndex = state.assignmentGroups[threadId].findIndex(
            group => group.id === groupId
          );
          
          if (groupIndex !== -1) {
            state.assignmentGroups[threadId][groupIndex].assignments.push(assignment);
            break;
          }
        }
        
        if (state.selectedGroup && state.selectedGroup.id === groupId) {
          state.selectedGroup.assignments.push(assignment);
        }
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update assignment
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAssignment = action.payload;
        
        // Find the assignment in all groups and update it
        for (const threadId in state.assignmentGroups) {
          for (const group of state.assignmentGroups[threadId]) {
            const assignmentIndex = group.assignments.findIndex(
              assignment => assignment.id === updatedAssignment.id
            );
            
            if (assignmentIndex !== -1) {
              group.assignments[assignmentIndex] = updatedAssignment;
              break;
            }
          }
        }
        
        if (state.selectedGroup) {
          const assignmentIndex = state.selectedGroup.assignments.findIndex(
            assignment => assignment.id === updatedAssignment.id
          );
          
          if (assignmentIndex !== -1) {
            state.selectedGroup.assignments[assignmentIndex] = updatedAssignment;
          }
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const assignmentId = action.payload;
        
        // Find the assignment in all groups and remove it
        for (const threadId in state.assignmentGroups) {
          for (const group of state.assignmentGroups[threadId]) {
            group.assignments = group.assignments.filter(
              assignment => assignment.id !== assignmentId
            );
          }
        }
        
        if (state.selectedGroup) {
          state.selectedGroup.assignments = state.selectedGroup.assignments.filter(
            assignment => assignment.id !== assignmentId
          );
        }
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add attachment
      .addCase(addAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const { assignmentId, attachment } = action.payload;
        
        // Find the assignment in all groups and add the attachment
        for (const threadId in state.assignmentGroups) {
          for (const group of state.assignmentGroups[threadId]) {
            const assignmentIndex = group.assignments.findIndex(
              assignment => assignment.id === assignmentId
            );
            
            if (assignmentIndex !== -1) {
              if (!group.assignments[assignmentIndex].attachments) {
                group.assignments[assignmentIndex].attachments = [];
              }
              
              group.assignments[assignmentIndex].attachments.push(attachment);
              break;
            }
          }
        }
        
        if (state.selectedGroup) {
          const assignmentIndex = state.selectedGroup.assignments.findIndex(
            assignment => assignment.id === assignmentId
          );
          
          if (assignmentIndex !== -1) {
            if (!state.selectedGroup.assignments[assignmentIndex].attachments) {
              state.selectedGroup.assignments[assignmentIndex].attachments = [];
            }
            
            state.selectedGroup.assignments[assignmentIndex].attachments.push(attachment);
          }
        }
      })
      .addCase(addAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete attachment
      .addCase(deleteAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.loading = false;
        const attachmentId = action.payload;
        
        // Find the attachment in all assignments and remove it
        for (const threadId in state.assignmentGroups) {
          for (const group of state.assignmentGroups[threadId]) {
            for (const assignment of group.assignments) {
              if (assignment.attachments) {
                assignment.attachments = assignment.attachments.filter(
                  attachment => attachment.id !== attachmentId
                );
              }
            }
          }
        }
        
        if (state.selectedGroup) {
          for (const assignment of state.selectedGroup.assignments) {
            if (assignment.attachments) {
              assignment.attachments = assignment.attachments.filter(
                attachment => attachment.id !== attachmentId
              );
            }
          }
        }
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedGroup } = assignmentSlice.actions;

export default assignmentSlice.reducer;
