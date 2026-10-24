const ticketTypes = [

    {
        id: "standard",
        label: "Standard",
        price: 9000,
        seatsLeft: 6
    },

    {
        id: "student",
        label: "Student",
        price: 6500,
        seatsLeft: 4
    },

    {
        id: "vip",
        label: "VIP",
        price: 15000,
        seatsLeft: 2
    }

];


const soldOutDates = [
    "2026-11-25",
    "2026-11-30"
];


const promoCodes = [

    {
        code: "TRAVEL10",
        discount: 10
    },

    {
        code: "AITU15",
        discount: 15
    }

];


const form =
    document.querySelector("#ticketForm");

const eventInput =
    document.querySelector("#event");

const dateInput =
    document.querySelector("#date");

const ticketTypeInput =
    document.querySelector("#ticketType");

const quantityInput =
    document.querySelector("#quantity");

const fullNameInput =
    document.querySelector("#fullName");

const emailInput =
    document.querySelector("#email");

const promoInput =
    document.querySelector("#promo");


const errorSummary =
    document.querySelector("#errorSummary");

const result =
    document.querySelector("#result");


const previewEvent =
    document.querySelector("#previewEvent");

const previewDate =
    document.querySelector("#previewDate");

const previewType =
    document.querySelector("#previewType");

const previewQuantity =
    document.querySelector("#previewQuantity");

const previewName =
    document.querySelector("#previewName");

const previewDiscount =
    document.querySelector("#previewDiscount");

const previewTotal =
    document.querySelector("#previewTotal");


const fields = [
    eventInput,
    dateInput,
    ticketTypeInput,
    quantityInput,
    fullNameInput,
    emailInput,
    promoInput
];


const touchedFields =
    new Set();


form.noValidate = true;


function getTicketType(id) {

    for (const type of ticketTypes) {

        if (type.id === id) {
            return type;
        }

    }

    return null;
}


function getPromo(code) {

    const normalizedCode =
        code
            .trim()
            .toUpperCase();


    for (const promo of promoCodes) {

        if (
            promo.code ===
            normalizedCode
        ) {

            return promo;

        }

    }

    return null;
}


function getErrorElement(field) {

    return document.querySelector(
        "#" + field.id + "Error"
    );

}


function getNativeError(field) {

    if (field.checkValidity()) {
        return "";
    }


    if (field.validity.valueMissing) {

        return "This field is required.";

    }


    if (field.validity.typeMismatch) {

        return "Enter a valid email address.";

    }


    if (field.validity.tooShort) {

        return (
            "Enter at least "
            + field.minLength
            + " characters."
        );

    }


    if (field.validity.tooLong) {

        return (
            "Use no more than "
            + field.maxLength
            + " characters."
        );

    }


    if (field.validity.rangeUnderflow) {

        return (
            "The minimum value is "
            + field.min
            + "."
        );

    }


    if (field.validity.rangeOverflow) {

        return (
            "The maximum value is "
            + field.max
            + "."
        );

    }


    if (field.validity.stepMismatch) {

        return "Enter a valid whole number.";

    }


    return "Enter a valid value.";
}


function getCustomError(field) {

    /*
        RULE 1:
        Sold-out dates
    */

    if (
        field === dateInput
        &&
        dateInput.value !== ""
        &&
        soldOutDates.includes(
            dateInput.value
        )
    ) {

        return "This date is sold out.";

    }


    /*
        RULE 2:
        VIP unavailable for City Tour
    */

    if (
        field === ticketTypeInput
        &&
        eventInput.value === "city-tour"
        &&
        ticketTypeInput.value === "vip"
    ) {

        return (
            "VIP tickets are not available "
            + "for the City Tour."
        );

    }


    /*
        RULE 3:
        Quantity cannot exceed seats left
    */

    if (
        field === quantityInput
        &&
        ticketTypeInput.value !== ""
        &&
        quantityInput.value !== ""
    ) {

        const type =
            getTicketType(
                ticketTypeInput.value
            );

        const quantity =
            Number(
                quantityInput.value
            );


        if (
            type
            &&
            quantity > type.seatsLeft
        ) {

            return (
                "Only "
                + type.seatsLeft
                + " "
                + type.label
                + " tickets are left."
            );

        }

    }


    /*
        RULE 4:
        Promo code must exist
    */

    if (
        field === promoInput
        &&
        promoInput.value.trim() !== ""
        &&
        !getPromo(promoInput.value)
    ) {

        return "Promo code not found.";

    }


    return "";
}


function validateField(field) {

    const errorElement =
        getErrorElement(field);


    let message =
        getNativeError(field);


    if (message === "") {

        message =
            getCustomError(field);

    }


    if (message !== "") {

        field.setAttribute(
            "aria-invalid",
            "true"
        );

        field.classList.add(
            "is-invalid"
        );

        field.classList.remove(
            "is-valid"
        );

        errorElement.textContent =
            message;

        return false;

    }


    field.setAttribute(
        "aria-invalid",
        "false"
    );

    field.classList.remove(
        "is-invalid"
    );


    if (
        field.value.trim() !== ""
    ) {

        field.classList.add(
            "is-valid"
        );

    } else {

        field.classList.remove(
            "is-valid"
        );

    }


    errorElement.textContent = "";

    return true;
}


function validateRelatedFields(field) {

    if (
        field === eventInput
        ||
        field === ticketTypeInput
    ) {

        if (
            touchedFields.has(
                ticketTypeInput.id
            )
        ) {

            validateField(
                ticketTypeInput
            );

        }

    }


    if (
        field === ticketTypeInput
        ||
        field === quantityInput
    ) {

        if (
            touchedFields.has(
                quantityInput.id
            )
        ) {

            validateField(
                quantityInput
            );

        }

    }

}


function getSelectedText(select) {

    if (select.value === "") {
        return "—";
    }

    return (
        select
            .selectedOptions[0]
            .textContent
    );

}


function calculateTotal() {

    const type =
        getTicketType(
            ticketTypeInput.value
        );


    const quantity =
        Number(
            quantityInput.value
        );


    if (
        !type
        ||
        !Number.isInteger(quantity)
        ||
        quantity < 1
    ) {

        return {
            total: 0,
            discount: 0
        };

    }


    let total =
        type.price * quantity;


    let discount = 0;


    const promo =
        getPromo(
            promoInput.value
        );


    if (promo) {

        discount =
            promo.discount;

        total =
            total
            - (
                total
                * discount
                / 100
            );

    }


    return {
        total:
            Math.round(total),

        discount: discount
    };
}


function updatePreview() {
    const previewEmail =
    document.querySelector("#previewEmail");

    previewEvent.textContent =
        eventInput.value === ""
            ? "Choose an event"
            : getSelectedText(
                eventInput
            );


    previewDate.textContent =
        dateInput.value || "—";


    previewType.textContent =
        getSelectedText(
            ticketTypeInput
        );


    previewQuantity.textContent =
        quantityInput.value || "—";


    previewName.textContent =
        fullNameInput.value.trim()
        || "—";


    const price =
        calculateTotal();


    previewDiscount.textContent =
        price.discount + "%";


    previewTotal.textContent =
        price.total + " ₸";

}


function generateBookingCode() {

    const number =
        Math.floor(
            Math.random()
            * 90000
        ) + 10000;


    return "BK-" + number;
}


function createResult(
    bookingCode,
    type,
    quantity,
    total
) {

    result.textContent = "";


    const heading =
        document.createElement("h2");

    heading.textContent =
        "Booking confirmed";


    const code =
        document.createElement("p");

    code.textContent =
        "Booking code: "
        + bookingCode;


    const eventText =
        document.createElement("p");

    eventText.textContent =
        "Event: "
        + getSelectedText(
            eventInput
        );


    const dateText =
        document.createElement("p");

    dateText.textContent =
        "Date: "
        + dateInput.value;


    const ticketText =
        document.createElement("p");

    ticketText.textContent =
        "Ticket: "
        + type.label
        + " × "
        + quantity;


    const nameText =
        document.createElement("p");

    nameText.textContent =
        "Name: "
        + fullNameInput.value.trim();


    const totalText =
        document.createElement("p");

    totalText.textContent =
        "Total: "
        + total
        + " ₸";


    result.appendChild(heading);
    result.appendChild(code);
    result.appendChild(eventText);
    result.appendChild(dateText);
    result.appendChild(ticketText);
    result.appendChild(nameText);
    result.appendChild(totalText);


    result.hidden = false;
}


function clearValidation() {

    for (const field of fields) {

        field.removeAttribute(
            "aria-invalid"
        );

        field.classList.remove(
            "is-invalid",
            "is-valid"
        );


        const errorElement =
            getErrorElement(field);

        errorElement.textContent = "";

    }


    errorSummary.hidden = true;

    errorSummary.textContent = "";

    touchedFields.clear();

}


for (const field of fields) {

    field.addEventListener(
        "blur",
        function () {

            touchedFields.add(
                field.id
            );

            validateField(field);

            validateRelatedFields(
                field
            );

        }
    );


    field.addEventListener(
        "input",
        function () {

            updatePreview();


            if (
                touchedFields.has(
                    field.id
                )
            ) {

                validateField(
                    field
                );

            }


            validateRelatedFields(
                field
            );

        }
    );


    field.addEventListener(
        "change",
        function () {

            updatePreview();


            if (
                touchedFields.has(
                    field.id
                )
            ) {

                validateField(
                    field
                );

            }


            validateRelatedFields(
                field
            );

        }
    );

}


form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const invalidFields = [];


        for (const field of fields) {

            touchedFields.add(
                field.id
            );


            const valid =
                validateField(field);


            if (!valid) {

                invalidFields.push(
                    field
                );

            }

        }


        /*
            Validate dependent fields again
        */

        validateField(
            ticketTypeInput
        );

        validateField(
            quantityInput
        );


        if (
            ticketTypeInput.getAttribute(
                "aria-invalid"
            ) === "true"
            &&
            !invalidFields.includes(
                ticketTypeInput
            )
        ) {

            invalidFields.push(
                ticketTypeInput
            );

        }


        if (
            quantityInput.getAttribute(
                "aria-invalid"
            ) === "true"
            &&
            !invalidFields.includes(
                quantityInput
            )
        ) {

            invalidFields.push(
                quantityInput
            );

        }


        if (
            invalidFields.length > 0
        ) {

            errorSummary.hidden = false;

            errorSummary.textContent =
                "Please fix "
                + invalidFields.length
                + " error(s) before creating your ticket.";


            errorSummary.focus();


            invalidFields[0].focus();


            return;
        }


        errorSummary.hidden = true;


        const type =
            getTicketType(
                ticketTypeInput.value
            );


        const quantity =
            Number(
                quantityInput.value
            );


        const price =
            calculateTotal();


        const bookingCode =
            generateBookingCode();



        createResult(
            bookingCode,
            type,
            quantity,
            price.total
        );



        /*
            Reduce available seats
        */

        type.seatsLeft -=
            quantity;


        form.reset();

        clearValidation();

        updatePreview();

        eventInput.focus();

    }
);


updatePreview();