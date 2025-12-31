import { Container, useColorModeValue, Box, Heading, VStack, Input, Button, useToast, SimpleGrid, Text, IconButton, HStack, Badge, Spinner, FormControl, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppointmentStore } from "../store/appointment";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

const ProvidersPage = () => {
  const [newProvider, setNewProvider] = useState({ name: "", specialty: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { providers, fetchProviders, createProvider, deleteProvider, loading } = useAppointmentStore();
  const toast = useToast();

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const validateForm = () => {
    const newErrors = {};
    if (!newProvider.name.trim()) newErrors.name = "Name is required";
    if (!newProvider.specialty.trim()) newErrors.specialty = "Specialty is required";
    if (!newProvider.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newProvider.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!newProvider.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(newProvider.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProvider = async () => {
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form", status: "error", duration: 3000, isClosable: true });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProvider)
      });
      
      // Check if response is OK
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Server Error: ${res.status}`);
        } else {
          throw new Error(`Server Error: ${res.status}. Is the backend server running?`);
        }
      }
      
      // Check content-type before parsing
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await res.json();
      toast({ title: data.success ? "Success" : "Error", description: data.message || (data.errors ? data.errors.join(", ") : "Unknown error"), status: data.success ? "success" : "error", duration: 3000, isClosable: true });
      
      if (data.success) {
        setNewProvider({ name: "", specialty: "", email: "", phone: "" });
        setErrors({});
        fetchProviders();
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProvider = async (providerId) => {
    const { success, message } = await deleteProvider(providerId);
    toast({ title: success ? "Success" : "Error", description: message, status: success ? "success" : "error", duration: 3000, isClosable: true });
  };

  const handleChange = (field) => (e) => {
    setNewProvider({ ...newProvider, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <Box w="full" bg={bg} p={6} rounded="xl" shadow="lg">
          <Heading as="h3" size="md" mb={4}>Add Provider</Heading>
          <VStack spacing={3}>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel fontSize="sm">Name</FormLabel>
              <Input placeholder="Name" value={newProvider.name} onChange={handleChange("name")} size="sm" isDisabled={isSubmitting} />
              {errors.name && <Text fontSize="xs" color="red.500" mt={1}>{errors.name}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.specialty}>
              <FormLabel fontSize="sm">Specialty</FormLabel>
              <Input placeholder="Specialty" value={newProvider.specialty} onChange={handleChange("specialty")} size="sm" isDisabled={isSubmitting} />
              {errors.specialty && <Text fontSize="xs" color="red.500" mt={1}>{errors.specialty}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input type="email" placeholder="Email" value={newProvider.email} onChange={handleChange("email")} size="sm" isDisabled={isSubmitting} />
              {errors.email && <Text fontSize="xs" color="red.500" mt={1}>{errors.email}</Text>}
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.phone}>
              <FormLabel fontSize="sm">Phone</FormLabel>
              <Input type="tel" placeholder="Phone" value={newProvider.phone} onChange={handleChange("phone")} size="sm" isDisabled={isSubmitting} />
              {errors.phone && <Text fontSize="xs" color="red.500" mt={1}>{errors.phone}</Text>}
            </FormControl>
            <Button colorScheme="blue" onClick={handleAddProvider} w="full" leftIcon={<AddIcon />} size="sm" isLoading={isSubmitting} loadingText="Adding...">Add</Button>
          </VStack>
        </Box>

        {loading ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} color="gray.500">Loading providers...</Text>
          </Box>
        ) : providers.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} w="full">
            {providers.map((provider) => (
              <Box key={provider._id} bg={bg} p={5} rounded="lg" shadow="md" _hover={{ shadow: "xl", transform: "translateY(-2px)" }} transition="all 0.3s">
                <HStack justify="space-between" mb={3}>
                  <Heading as="h4" size="sm">{provider.name}</Heading>
                  <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProvider(provider._id)} colorScheme="red" size="xs" aria-label="Delete" />
                </HStack>
                <Badge colorScheme="blue" mb={3} fontSize="xs">{provider.specialty}</Badge>
                <VStack align="stretch" spacing={1}>
                  <Text fontSize="xs" color={textColor}>{provider.email}</Text>
                  <Text fontSize="xs" color={textColor}>{provider.phone}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12} bg={bg} rounded="lg" shadow="md" w="full">
            <Text color="gray.500">No providers available</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default ProvidersPage;
