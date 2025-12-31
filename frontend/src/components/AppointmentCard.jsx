import { useState } from "react";
import { EditIcon, DeleteIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { Box, IconButton, Heading, useColorModeValue, HStack, useToast, useDisclosure, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, Button, Select, Badge, Divider } from "@chakra-ui/react";
import { useAppointmentStore } from "../store/appointment";

const AppointmentCard = ({ appointment }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updatedAppointment, setUpdatedAppointment] = useState({
    patientName: appointment.patientName,
    patientEmail: appointment.patientEmail,
    patientPhone: appointment.patientPhone,
    providerName: appointment.providerName,
    providerSpecialty: appointment.providerSpecialty,
    appointmentDate: appointment.appointmentDate ? appointment.appointmentDate.split('T')[0] : '',
    appointmentTime: appointment.appointmentTime,
    reason: appointment.reason,
    status: appointment.status,
    notes: appointment.notes || ''
  });

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const { updateAppointment, deleteAppointment } = useAppointmentStore();

  const getStatusColor = (status) => {
    const colors = { scheduled: 'blue', completed: 'green', cancelled: 'red', rescheduled: 'yellow' };
    return colors[status] || 'gray';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleUpdate = async () => {
    const { success, message } = await updateAppointment(appointment._id, updatedAppointment);
    onClose();
    toast({ title: success ? "Success" : "Error", description: message, status: success ? "success" : "error", duration: 3000, isClosable: true });
  };

  const handleDelete = async () => {
    const { success, message } = await deleteAppointment(appointment._id);
    toast({ title: success ? "Success" : "Error", description: message, status: success ? "success" : "error", duration: 3000, isClosable: true });
  };

  const handleChange = (field) => (e) => setUpdatedAppointment({ ...updatedAppointment, [field]: e.target.value });

  return (
    <Box shadow="lg" rounded="lg" overflow="hidden" transition="all 0.3s" _hover={{ transform: "translateY(-5px)", shadow: "xl" }} bg={bg} p={5}>
      <HStack justify="space-between" mb={3}>
        <Heading as="h3" size="sm">{appointment.providerName}</Heading>
        <Badge colorScheme={getStatusColor(appointment.status)} fontSize="xs" px={2} py={1}>{appointment.status?.toUpperCase() || 'SCHEDULED'}</Badge>
      </HStack>

      <VStack align="stretch" spacing={2}>
        <Text fontSize="xs" color="gray.500">{appointment.providerSpecialty}</Text>
        <Divider />
        <Text fontWeight="semibold" fontSize="sm">{appointment.patientName}</Text>
        <Text fontSize="xs" color={textColor}>{appointment.patientEmail}</Text>
        <Text fontSize="xs" color={textColor}>{appointment.patientPhone}</Text>
        <Divider />
        <HStack spacing={3}>
          <HStack spacing={1}>
            <CalendarIcon fontSize="xs" />
            <Text fontSize="xs" fontWeight="semibold">{formatDate(appointment.appointmentDate)}</Text>
          </HStack>
          <HStack spacing={1}>
            <TimeIcon fontSize="xs" />
            <Text fontSize="xs" fontWeight="semibold">{appointment.appointmentTime}</Text>
          </HStack>
        </HStack>
        {appointment.reason && <Text fontSize="xs" color={textColor} mt={1}>{appointment.reason}</Text>}
      </VStack>

      <HStack spacing={2} mt={4} justify="flex-end">
        <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" size="xs" aria-label="Edit" />
        <IconButton icon={<DeleteIcon />} onClick={handleDelete} colorScheme="red" size="xs" aria-label="Delete" />
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">Edit Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              {['patientName', 'patientEmail', 'patientPhone', 'providerName', 'providerSpecialty', 'reason'].map((field) => (
                <Input key={field} placeholder={field.replace(/([A-Z])/g, ' $1').trim()} value={updatedAppointment[field]} onChange={handleChange(field)} size="sm" />
              ))}
              <Input type="date" value={updatedAppointment.appointmentDate} onChange={handleChange('appointmentDate')} size="sm" />
              <Input type="time" value={updatedAppointment.appointmentTime} onChange={handleChange('appointmentTime')} size="sm" />
              <Select value={updatedAppointment.status} onChange={handleChange('status')} size="sm">
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </Select>
              <Input placeholder="Notes" value={updatedAppointment.notes} onChange={handleChange('notes')} size="sm" />
            </VStack>
          </ModalBody>
          <Box p={4}>
            <HStack justify="flex-end">
              <Button colorScheme="blue" onClick={handleUpdate} size="sm">Update</Button>
              <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
            </HStack>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AppointmentCard;
