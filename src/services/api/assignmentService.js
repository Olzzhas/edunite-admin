import apiClient from './apiClient';
import { MOCK_ASSIGNMENT_GROUPS } from './mockData';

// Use real API data
const MOCK_API = false;

const assignmentService = {
  getAssignmentGroups: async (threadId) => {
    if (MOCK_API) {
      const groups = MOCK_ASSIGNMENT_GROUPS.filter(g => g.threadId === parseInt(threadId));
      return groups;
    } else {
      const response = await apiClient.get(`/assignments/groups/thread/${threadId}`);
      return response.data;
    }
  },

  getAssignmentGroupById: async (groupId) => {
    if (MOCK_API) {
      const group = MOCK_ASSIGNMENT_GROUPS.find(g => g.id === parseInt(groupId));
      if (!group) throw new Error('Assignment group not found');
      return group;
    } else {
      const response = await apiClient.get(`/assignments/groups/${groupId}`);
      return response.data;
    }
  },

  createAssignmentGroup: async (groupData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_ASSIGNMENT_GROUPS.map(g => g.id)) + 1;

      // Create new group
      const newGroup = {
        id: newId,
        assignments: [],
        ...groupData,
      };

      // Add to mock data
      MOCK_ASSIGNMENT_GROUPS.push(newGroup);

      return newGroup;
    } else {
      const response = await apiClient.post('/assignments/groups', groupData);
      return response.data;
    }
  },

  updateAssignmentGroup: async (groupId, groupData) => {
    if (MOCK_API) {
      const index = MOCK_ASSIGNMENT_GROUPS.findIndex(g => g.id === parseInt(groupId));
      if (index === -1) throw new Error('Assignment group not found');

      // Update group
      const updatedGroup = {
        ...MOCK_ASSIGNMENT_GROUPS[index],
        ...groupData,
      };

      // Replace in mock data
      MOCK_ASSIGNMENT_GROUPS[index] = updatedGroup;

      return updatedGroup;
    } else {
      const response = await apiClient.put(`/assignments/groups/${groupId}`, groupData);
      return response.data;
    }
  },

  deleteAssignmentGroup: async (groupId) => {
    if (MOCK_API) {
      const index = MOCK_ASSIGNMENT_GROUPS.findIndex(g => g.id === parseInt(groupId));
      if (index === -1) throw new Error('Assignment group not found');

      // Remove from mock data
      MOCK_ASSIGNMENT_GROUPS.splice(index, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/assignments/groups/${groupId}`);
      return response.data;
    }
  },

  createAssignment: async (groupId, assignmentData) => {
    if (MOCK_API) {
      const groupIndex = MOCK_ASSIGNMENT_GROUPS.findIndex(g => g.id === parseInt(groupId));
      if (groupIndex === -1) throw new Error('Assignment group not found');

      // Generate a new ID
      const assignmentIds = MOCK_ASSIGNMENT_GROUPS.flatMap(g => g.assignments.map(a => a.id));
      const newId = assignmentIds.length > 0 ? Math.max(...assignmentIds) + 1 : 1;

      // Create new assignment
      const newAssignment = {
        id: newId,
        groupId: parseInt(groupId),
        attachments: [],
        ...assignmentData,
      };

      // Add to group
      MOCK_ASSIGNMENT_GROUPS[groupIndex].assignments.push(newAssignment);

      return newAssignment;
    } else {
      const response = await apiClient.post(`/assignments/groups/${groupId}/assignments`, assignmentData);
      return response.data;
    }
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    if (MOCK_API) {
      // Find the assignment in all groups
      let foundAssignment = null;
      let groupIndex = -1;
      let assignmentIndex = -1;

      for (let i = 0; i < MOCK_ASSIGNMENT_GROUPS.length; i++) {
        const aIndex = MOCK_ASSIGNMENT_GROUPS[i].assignments.findIndex(a => a.id === parseInt(assignmentId));
        if (aIndex !== -1) {
          foundAssignment = MOCK_ASSIGNMENT_GROUPS[i].assignments[aIndex];
          groupIndex = i;
          assignmentIndex = aIndex;
          break;
        }
      }

      if (!foundAssignment) throw new Error('Assignment not found');

      // Update assignment
      const updatedAssignment = {
        ...foundAssignment,
        ...assignmentData,
      };

      // Replace in mock data
      MOCK_ASSIGNMENT_GROUPS[groupIndex].assignments[assignmentIndex] = updatedAssignment;

      return updatedAssignment;
    } else {
      const response = await apiClient.put(`/assignments/${assignmentId}`, assignmentData);
      return response.data;
    }
  },

  deleteAssignment: async (assignmentId) => {
    if (MOCK_API) {
      // Find the assignment in all groups
      let groupIndex = -1;
      let assignmentIndex = -1;

      for (let i = 0; i < MOCK_ASSIGNMENT_GROUPS.length; i++) {
        const aIndex = MOCK_ASSIGNMENT_GROUPS[i].assignments.findIndex(a => a.id === parseInt(assignmentId));
        if (aIndex !== -1) {
          groupIndex = i;
          assignmentIndex = aIndex;
          break;
        }
      }

      if (groupIndex === -1 || assignmentIndex === -1) throw new Error('Assignment not found');

      // Remove from mock data
      MOCK_ASSIGNMENT_GROUPS[groupIndex].assignments.splice(assignmentIndex, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/assignments/${assignmentId}`);
      return response.data;
    }
  },

  addAttachment: async (assignmentId, file) => {
    if (MOCK_API) {
      // Find the assignment in all groups
      let foundAssignment = null;
      let groupIndex = -1;
      let assignmentIndex = -1;

      for (let i = 0; i < MOCK_ASSIGNMENT_GROUPS.length; i++) {
        const aIndex = MOCK_ASSIGNMENT_GROUPS[i].assignments.findIndex(a => a.id === parseInt(assignmentId));
        if (aIndex !== -1) {
          foundAssignment = MOCK_ASSIGNMENT_GROUPS[i].assignments[aIndex];
          groupIndex = i;
          assignmentIndex = aIndex;
          break;
        }
      }

      if (!foundAssignment) throw new Error('Assignment not found');

      // Generate a new ID for the attachment
      const attachmentIds = MOCK_ASSIGNMENT_GROUPS.flatMap(g =>
        g.assignments.flatMap(a => a.attachments.map(att => att.id))
      );
      const newId = attachmentIds.length > 0 ? Math.max(...attachmentIds) + 1 : 1;

      // Create new attachment
      const newAttachment = {
        id: newId,
        name: file.name || `attachment-${newId}.pdf`,
        url: URL.createObjectURL(file) || `https://example.com/files/attachment-${newId}.pdf`,
        uploadedAt: new Date().toISOString(),
      };

      // Add to assignment
      MOCK_ASSIGNMENT_GROUPS[groupIndex].assignments[assignmentIndex].attachments.push(newAttachment);

      return newAttachment;
    } else {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`/assignments/${assignmentId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    }
  },

  getAttachments: async (assignmentId) => {
    if (MOCK_API) {
      // Find the assignment in all groups
      let foundAssignment = null;

      for (let i = 0; i < MOCK_ASSIGNMENT_GROUPS.length; i++) {
        const assignment = MOCK_ASSIGNMENT_GROUPS[i].assignments.find(a => a.id === parseInt(assignmentId));
        if (assignment) {
          foundAssignment = assignment;
          break;
        }
      }

      if (!foundAssignment) throw new Error('Assignment not found');

      return foundAssignment.attachments;
    } else {
      const response = await apiClient.get(`/assignments/${assignmentId}/attachments`);
      return response.data;
    }
  },

  deleteAttachment: async (attachmentId) => {
    if (MOCK_API) {
      // Find the attachment in all groups and assignments
      let groupIndex = -1;
      let assignmentIndex = -1;
      let attachmentIndex = -1;

      for (let i = 0; i < MOCK_ASSIGNMENT_GROUPS.length; i++) {
        for (let j = 0; j < MOCK_ASSIGNMENT_GROUPS[i].assignments.length; j++) {
          const attIndex = MOCK_ASSIGNMENT_GROUPS[i].assignments[j].attachments.findIndex(
            a => a.id === parseInt(attachmentId)
          );
          if (attIndex !== -1) {
            groupIndex = i;
            assignmentIndex = j;
            attachmentIndex = attIndex;
            break;
          }
        }
        if (groupIndex !== -1) break;
      }

      if (groupIndex === -1 || assignmentIndex === -1 || attachmentIndex === -1) {
        throw new Error('Attachment not found');
      }

      // Remove from mock data
      MOCK_ASSIGNMENT_GROUPS[groupIndex].assignments[assignmentIndex].attachments.splice(attachmentIndex, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/assignments/attachments/${attachmentId}`);
      return response.data;
    }
  },
};

export default assignmentService;
