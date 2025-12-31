import { Container, useColorModeValue, Box, Heading, VStack, Input, Button, useToast, Select, Textarea, FormControl, FormLabel, Text, FormErrorMessage, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppointmentStore } from "../store/appointment";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const initialAppointment = { patientName: "", patientEmail: "", patientPhone: "", providerName: "", providerSpecialty: "", appointmentDate: "", appointmentTime: "", reason: "", notes: "" };
  const [newAppointment, setNewAppointment] = useState(initialAppointment);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { createAppointment, fetchProviders, providers, loading } = useAppointmentStore();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!newAppointment.patientName.trim()) newErrors.patientName = "Name is required";
    if (!newAppointment.patientEmail.trim()) {
      newErrors.patientEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAppointment.patientEmail)) {
      newErrors.patientEmail = "Invalid email format";
    }
    if (!newAppointment.patientPhone.trim()) {
      newErrors.patientPhone = "Phone is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(newAppointment.patientPhone)) {
      newErrors.patientPhone = "Invalid phone format";
    }
    if (!newAppointment.providerName.trim()) newErrors.providerName = "Provider name is required";
    if (!newAppointment.providerSpecialty.trim()) newErrors.providerSpecialty = "Specialty is required";
    if (!newAppointment.appointmentDate) newErrors.appointmentDate = "Date is required";
    if (!newAppointment.appointmentTime) newErrors.appointmentTime = "Time is required";
    if (!newAppointment.reason.trim()) {
      newErrors.reason = "Reason is required";
    } else if (newAppointment.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookAppointment = async () => {
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form", status: "error", duration: 3000, isClosable: true });
      return;
    }
    
    setIsLoading(true);
    const { success, message } = await createAppointment(newAppointment);
    setIsLoading(false);
    
    toast({ title: success ? "Success" : "Error", description: message, status: success ? "success" : "error", duration: 3000, isClosable: true });
    if (success) {
      setNewAppointment(initialAppointment);
      setErrors({});
      setTimeout(() => navigate("/"), 1500);
    }
  };

  const handleProviderChange = (e) => {
    const selectedProvider = providers.find(p => p._id === e.target.value);
    if (selectedProvider) {
      setNewAppointment({ ...newAppointment, providerName: selectedProvider.name, providerSpecialty: selectedProvider.specialty });
      setErrors({ ...errors, providerName: "", providerSpecialty: "" });
    }
  };

  const handleChange = (field) => (e) => {
    setNewAppointment({ ...newAppointment, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const formFields = [
    { section: "Patient", fields: [
      { label: "Name", name: "patientName", type: "text", placeholder: "Full name" },
      { label: "Email", name: "patientEmail", type: "email", placeholder: "email@example.com" },
      { label: "Phone", name: "patientPhone", type: "tel", placeholder: "+1-555-0000" }
    ]},
    { section: "Provider", fields: [
      { label: "Name", name: "providerName", type: "text", placeholder: "Dr. Name" },
      { label: "Specialty", name: "providerSpecialty", type: "text", placeholder: "Cardiology, Pediatrics, etc." }
    ]},
    { section: "Appointment", fields: [
      { label: "Date", name: "appointmentDate", type: "date", min: new Date().toISOString().split('T')[0] },
      { label: "Time", name: "appointmentTime", type: "time" },
      { label: "Reason", name: "reason", type: "textarea", placeholder: "Brief description (min 10 characters)", rows: 3 },
      { label: "Notes", name: "notes", type: "textarea", placeholder: "Optional", rows: 2, required: false }
    ]}
  ];

  return (
    <Container maxW="container.md" py={8}>
      <Box w="full" bg={useColorModeValue("white", "gray.800")} p={8} rounded="xl" shadow="lg">
        <VStack spacing={5}>
          {formFields.map((section, idx) => (
            <Box key={idx} w="full">
              <Heading as="h3" size="sm" mb={3} color="gray.500" textTransform="uppercase" letterSpacing="wide">{section.section}</Heading>
              {section.section === "Provider" && (
                <>
                  <FormControl isRequired mb={3}>
                    <Select placeholder="Select provider" value={providers.find(p => p.name === newAppointment.providerName)?._id || ""} onChange={handleProviderChange} isDisabled={loading}>
                      {providers.map((provider) => <option key={provider._id} value={provider._id}>{provider.name} - {provider.specialty}</option>)}
                    </Select>
                  </FormControl>
                  {providers.length === 0 && !loading && <Text color="gray.500" fontSize="sm" mb={3}>No providers available</Text>}
                  {loading && <Text color="gray.500" fontSize="sm" mb={3}>Loading providers...</Text>}
                </>
              )}
              <VStack spacing={3}>
                {section.fields.map((field) => (
                  <FormControl key={field.name} isRequired={field.required !== false} isInvalid={!!errors[field.name]}>
                    <FormLabel fontSize="sm" mb={1}>{field.label}</FormLabel>
                    {field.type === "textarea" ? (
                      <Textarea placeholder={field.placeholder} value={newAppointment[field.name]} onChange={handleChange(field.name)} rows={field.rows} size="sm" isDisabled={isLoading} />
                    ) : (
                      <Input type={field.type} placeholder={field.placeholder} value={newAppointment[field.name]} onChange={handleChange(field.name)} min={field.min} size="sm" isDisabled={isLoading} />
                    )}
                    {errors[field.name] && <FormErrorMessage fontSize="xs">{errors[field.name]}</FormErrorMessage>}
                  </FormControl>
                ))}
              </VStack>
            </Box>
          ))}
          <Button colorScheme="blue" onClick={handleBookAppointment} w="full" size="lg" mt={2} isLoading={isLoading} loadingText="Booking...">
            Book Appointment
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default CreatePage;
