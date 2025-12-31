import AppointmentCard from "../components/AppointmentCard";
import { useEffect, useState } from "react";
import { Container, useColorModeValue, Box, Link, VStack, Text, SimpleGrid, Button, Spinner, Input, HStack, Select, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { useAppointmentStore } from "../store/appointment";
import { CalendarIcon } from "@chakra-ui/icons";

const HomePage = () => {
  const { fetchAppointments, appointments, loading, error } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = !searchTerm || 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        {error && (
          <Alert status="error" borderRadius="md" w="full">
            <AlertIcon />
            <Box>
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                {error.includes("backend server") ? (
                  <>
                    Backend server is not running. Please start it with: <code>npm run dev</code>
                  </>
                ) : (
                  error
                )}
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <HStack w="full" spacing={4} flexWrap="wrap">
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            maxW="300px"
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="sm"
            maxW="200px"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </Select>
        </HStack>

        {loading ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} color="gray.500">Loading appointments...</Text>
          </Box>
        ) : filteredAppointments.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} w="full">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={16} px={6} bg={useColorModeValue("white", "gray.800")} rounded="xl" shadow="md" w="full" maxW="md">
            <Text fontSize="lg" color="gray.500" mb={4}>
              {searchTerm || statusFilter ? "No appointments match your filters" : "No appointments yet"}
            </Text>
            {!searchTerm && !statusFilter && (
              <Link href="/book">
                <Button colorScheme="blue" leftIcon={<CalendarIcon />} size="lg">Book Appointment</Button>
              </Link>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
