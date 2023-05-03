import React from 'react';
import {
    Welcome,
    UpdateDob,
    SaveGender,
    SaveSymptoms,
    AskRiskFactors,
    SuggestForFactors,
    RiskFactorText,
    SuggestionText,
    AskRiskFactorsTravel,
    RiskFactorTravelText,
    Diagnosis,
    DiagnosisText
} from './index';
import ChatbotCustom from '../ChatbotCustom';
export const initialSteps = [
    {
        id: "hi-again",
        message: "Welcome 😊",
        trigger: 'hello-there'
    },
    {
        id: 'hello-there',
        component: <Welcome />,
        waitAction: true,
        replace: true
    },
    {
        id: 'accept-message',
        message: "Thanks! Let me ask you couple of Questions.",
        trigger: 'age-component'
    },
    {
        id: 'decline-message',
        message: "Okay. Thanks!",
        end: true
    },
    {
        id: 'age-component',
        component: <ChatbotCustom />,
        asMessage: true,
        trigger: 'trigger_age'
    },
    {
        id: 'trigger_age',
        user: true,
        placeholder: "Kindly Enter Your Age",
        validator: (value) => {
            if (isNaN(value)) {
                return 'Age should be a number';
            }
            else if (value < 1 || value > 150) {
                return 'Kindly enter Valid Age.';
            }
            else if (!value) {
                return 'Kindly Enter Age';
            }
            return true;
        },
        trigger: 'store-age'
    },
    {
        id: 'store-age',
        component: <UpdateDob />,
        asMessage: true,
        trigger: 'ask_gender'
    },
    {
        id: 'ask_gender',
        options: [
            { value: 'Male', label: 'Male', trigger: 'save_gender_ask_symptom' },
            { value: 'Female', label: 'Female', trigger: 'save_gender_ask_symptom' },
        ],

    },
    {
        id: 'save_gender_ask_symptom',
        component: <SaveGender />,
        asMessage: true,
        trigger: 'ask_symptoms',

    },
    {
        id:'show_symptom_message',
        message:"What concerns you most about your health? Please describe your symptoms.",
        trigger:  'ask_symptoms'
    },
    {
        id: 'ask_symptoms',
        user: true,
        placeholder: "Kindly Enter Symptoms",
        validator: (value) => {
            if (!value) {
                return 'Kindly Enter Symptoms';
            }
            return true;
        },
        trigger: 'save_symptoms',
        hideInput: true
    },
    {
        id: 'save_symptoms',
        component: <SaveSymptoms />,
        waitAction: true,
        asMessage: true,
    },
    {
        id: 'ask_risk_factors',
        component: <AskRiskFactors />,
        waitAction: true,
        asMessage: true,
        hideInput: true
        //replace:true,
    },
    {
        id: 'risk_factors_text',
        component: <RiskFactorText />,
        // waitAction: true,
        asMessage: true,
        trigger: 'suggest_for_factors',
        hideInput: true
    },
    {
        id: 'suggest_for_factors',
        component: <SuggestForFactors />,
        waitAction: true,
        asMessage: true,
        hideInput: true
        //replace: true,
    },
    {
        id: 'suggestion_text',
        component: <SuggestionText />,
        // waitAction: true,
        asMessage: true,
        trigger: 'ask_risk_factors_travel',
        hideInput: true
    },
    {
        id: 'ask_risk_factors_travel',
        component: <AskRiskFactorsTravel />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },
    {
        id: 'risk_factors_travel_text',
        component: <RiskFactorTravelText />,
        asMessage: true,
        trigger: 'proceed_to_diagnosis',
        hideInput: true
    },
    {
        id: 'proceed_to_diagnosis',
        component: <Diagnosis />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },
    {
        id: 'diagnosis_text',
        component: <DiagnosisText />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },

];

export const furtherSteps = [
    {
        id: 'ask_symptoms',
        user: true,
        placeholder: "Kindly Enter Symptoms",
        validator: (value) => {
            if (!value) {
                return 'Kindly Enter Symptoms';
            }
            return true;
        },
        trigger: 'save_symptoms',
        hideInput: true
    },
    {
        id: 'save_symptoms',
        component: <SaveSymptoms />,
        waitAction: true,
        asMessage: true,
    },
    {
        id: 'ask_risk_factors',
        component: <AskRiskFactors />,
        waitAction: true,
        asMessage: true,
        hideInput: true
        //replace:true,
    },
    {
        id: 'risk_factors_text',
        component: <RiskFactorText />,
        // waitAction: true,
        asMessage: true,
        trigger: 'suggest_for_factors',
        hideInput: true
    },
    {
        id: 'suggest_for_factors',
        component: <SuggestForFactors />,
        waitAction: true,
        asMessage: true,
        hideInput: true
        //replace: true,
    },
    {
        id: 'suggestion_text',
        component: <SuggestionText />,
        // waitAction: true,
        asMessage: true,
        trigger: 'ask_risk_factors_travel',
        hideInput: true
    },
    {
        id: 'ask_risk_factors_travel',
        component: <AskRiskFactorsTravel />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },
    {
        id: 'risk_factors_travel_text',
        component: <RiskFactorTravelText />,
        asMessage: true,
        trigger: 'proceed_to_diagnosis',
        hideInput: true
    },
    {
        id: 'proceed_to_diagnosis',
        component: <Diagnosis />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },
    {
        id: 'diagnosis_text',
        component: <DiagnosisText />,
        waitAction: true,
        asMessage: true,
        hideInput: true
    },

];