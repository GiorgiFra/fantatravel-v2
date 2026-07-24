package com.fantatravel.travel.model;

public enum TravelStatus {
    DRAFT,      // regole modificabili, viaggiatori possono joinare
    ACTIVE,     // freeze regole, assegnazione punti in corso
    COMPLETED   // viaggio finito, assegnazione special categories
}
