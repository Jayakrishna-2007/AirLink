package com.airbooking.service;

import com.airbooking.model.Booking;
import com.airbooking.model.Ticket;
import com.airbooking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public Ticket generateTicket(Booking booking) {
        String ticketNum = "ETKT-" + (100000000L + new Random().nextInt(900000000));
        Ticket ticket = new Ticket(booking, ticketNum);
        ticket.setIssuedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }
}
