create or replace PACKAGE BODY     EOR.OFFENDER_RSR_SCORES_PKG as 
/********************************************************************************

$Header: file:///svn/OASYS/branches/6.39.0.0/PKB/OFFENDER_RSR_SCORES_PKG.pkb/OFFENDER_RSR_SCORES_PKG.pkb 11847 2023-03-09 13:40:55Z kelvin $

*********************************************************************************
set serveroutput on;
DECLARE
l_op_offender_rsr_scores_pk   offender_rsr_scores.offender_rsr_scores_pk%type;
BEGIN
--
APEX_CUSTOM_AUTH.SET_SESSION_ID( p_session_id => 16605184389346 );
--
dbms_output.put_line('v(APP_SESSION) [' || v('APP_SESSION') ||']');
OFFENDER_RSR_SCORES_PKG.get_rsr_record(ip_offender_pk => 861382,
                                       op_offender_rsr_scores_pk => l_op_offender_rsr_scores_pk);
dbms_output.put_line('l_op_offender_rsr_scores_pk [' || l_op_offender_rsr_scores_pk ||']');
END;

*******************************************************************************/
--
-- Get the offencder current offence based on the oasys_set.
-- =========================================================
FUNCTION get_current_offence(pv_oasys_set_pk oasys_set.oasys_set_pk%type) RETURN ty_offence_block_rec
IS
--
lv_offence_block_rec    ty_offence_block_rec;
BEGIN
--
    for rec in ( SELECT OFFENCE_GROUP_CODE, SUB_CODE, ADDITIONAL_OFFENCE_IND
                 FROM OFFENCE_BLOCK OB
                 LEFT OUTER JOIN CT_OFFENCE_PIVOT OP
                 ON OP.OFFENCE_BLOCK_PK = OB.OFFENCE_BLOCK_PK
                 WHERE OB.OASYS_SET_PK = pv_oasys_set_pk
                 AND OB.OFFENCE_BLOCK_TYPE_ELM = 'CURRENT'
    )
    LOOP
        IF ( rec.ADDITIONAL_OFFENCE_IND = 'N' ) THEN
        lv_offence_block_rec.OFFENCE_GROUP_CODE := rec.OFFENCE_GROUP_CODE;
        lv_offence_block_rec.SUB_CODE := rec.SUB_CODE;
        END IF;
    END LOOP;
--
    RETURN lv_offence_block_rec;
--
exception when others then
    elog_api.ins;
    raise;
END get_current_offence;

-- ##
FUNCTION is_historic_outside_period(r_latest_assessment_pk oasys_set.oasys_set_pk%type) RETURN BOOLEAN
is
--
    l_count number := 0;
    l_clone_hist_limit_mnths number := to_number(app_utils_pkg.get_system_parameter(assessment_utils_pkg.gc_clone_time_limit_param_code));
--
begin
--
    select count(*) INTO l_count from oasys_assessment_vw
    where oasys_set_pk = r_latest_assessment_pk
    and historic_status_elm = 'HISTORIC'
    and PURPOSE_ASSESSMENT_CAT <> 'PURPOSE_OF_BCS_REASON'
    and trunc(nvl(date_completed,sysdate)) < trunc(add_months(sysdate, - l_clone_hist_limit_mnths)) 
    and deleted_date is null;
--
    if l_count > 0 then
        return TRUE;
    else
        Return FALSE;
    end if;
--
exception when others then
    elog_api.ins;
    raise;
end is_historic_outside_period;
-- ##
-- 
PROCEDURE update_from_assessment( p_in_oasys_set_pk   IN  oasys_set.oasys_set_pk%TYPE,
                                  io_offender_rsr_score_row IN OUT offender_rsr_scores%ROWTYPE)
IS
--
lv_V2                   varchar2(10) := NULL;
lv_offence_block_rec    ty_offence_block_rec;
lv_number_of_months     number := -1;
--
BEGIN
  --
  -- Read current OASYS_SET record
    oasys_set_api.g_row.oasys_set_pk := p_in_oasys_set_pk;
    oasys_set_api.get;
  --
  IF ASSESSMENT_UTILS_PKG.CHECK_IS_AFTER_RELEASE('6.24.0.0',oasys_set_api.g_row.initiation_date) THEN
    lv_V2 := '_V2';
  END IF;
  --
  -- ans_R1.2.10.1_V2
      FOR lv_rec IN ( SELECT REF_QUESTION_CODE,FREE_FORMAT_ANSWER
                    FROM
                    (
                    SELECT OQ.REF_QUESTION_CODE, DECODE(OQ.FREE_FORMAT_ANSWER,null,OA.REF_ANSWER_CODE,OQ.FREE_FORMAT_ANSWER) FREE_FORMAT_ANSWER
                    FROM OASYS_SET OS
                    LEFT OUTER JOIN OASYS_SECTION OSEC
                    ON OSEC.OASYS_SET_PK = OS.OASYS_SET_PK
                    LEFT OUTER JOIN OASYS_QUESTION OQ
                    ON OQ.OASYS_SECTION_PK = OSEC.OASYS_SECTION_PK
                    LEFT OUTER JOIN OASYS_ANSWER OA
                    ON OA.OASYS_QUESTION_PK = OQ.OASYS_QUESTION_PK
                    WHERE OS.OASYS_SET_PK = p_in_oasys_set_pk
                    --AND OQ.CURRENTLY_HIDDEN_IND = 'N'
                    AND OQ.REF_QUESTION_CODE IN ('1.30','1.34','1.35','1.36','1.37','1.38','1.33','1.5','1.6',
                    '1.31','1.32','1.42','1.41','1.40','1.43','1.8','1.24','1.26','1.7','1.29','2.2','2.2.t','3.4','4.2','6.4','6.7','6.7.1','9.1','9.2',
                    '11.2','11.4','12.1','R1.2.1.2' || lv_V2,'R1.2.2.2' || lv_V2,'R1.2.9.2' || lv_V2,'R1.2.10.2' || lv_V2,'R1.2.12.2' || lv_V2,'R1.2.6.2' || lv_V2,
                    'R1.2.13.2' || lv_V2,'R1.2.8.2' || lv_V2,'R1.2.7.2' || lv_V2,'R1.2.13.1_V2','R1.2.10.1_V2','1.39','6.7da','6.7.2.1da','6.7.2.2da','6.7.1.1da','6.7.1.2da')
                    ) )
    LOOP
--
        CASE lv_rec.REF_QUESTION_CODE
        WHEN '1.30' THEN  -- Store for later
            io_offender_rsr_score_row.S1_30_SEXUAL_ELEMENT := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.32' THEN  -- Store for later
            io_offender_rsr_score_row.S1_32_TOTAL_SANCTIONS := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.34' THEN
            io_offender_rsr_score_row.S1_34_CONTACT_ADULT_SCORE := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.35' THEN
            io_offender_rsr_score_row.S1_35_CONTACT_CHILD_SCORE := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.36' THEN
            io_offender_rsr_score_row.S1_36_INDECENT_IMAGES := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.37' THEN
            io_offender_rsr_score_row.S1_37_NON_CONTACT_SCORE := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.38' THEN
            io_offender_rsr_score_row.S1_38_COMMUNITY_DATE := TO_DATE(lv_rec.FREE_FORMAT_ANSWER,'DD/MM/YYYY');
        WHEN '1.40' THEN  -- Store for later
            io_offender_rsr_score_row.S1_40_VIOLENT_SANCTIONS := lv_rec.FREE_FORMAT_ANSWER;            
        WHEN '1.41' THEN  -- Store for later
            io_offender_rsr_score_row.S1_41_CURRENT_SEXUAL_MOT := lv_rec.FREE_FORMAT_ANSWER;            
        WHEN '1.42' THEN  -- Store for later
            io_offender_rsr_score_row.S1_42_STRANGER_VICTIM := lv_rec.FREE_FORMAT_ANSWER;            
        WHEN '1.43' THEN  -- Store for later
            io_offender_rsr_score_row.S1_43_LAST_OFFENCE_DATE := lv_rec.FREE_FORMAT_ANSWER;            
        WHEN '1.33' THEN
            io_offender_rsr_score_row.S1_33_DATE_RECENT_SEX_OFFENCE := TO_DATE(lv_rec.FREE_FORMAT_ANSWER,'DD/MM/YYYY');
        --WHEN '1.5' THEN  -- Store for later
        --    lv_answer_code_1_5 := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '1.6' THEN  -- Store for later
        --    lv_answer_code_1_6 := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.8' THEN  -- Store for later
            io_offender_rsr_score_row.S1_8_AGE_AT_FIRST_SANCTION := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '1.24' THEN  -- Store for later
        --    lv_answer_code_1_24 := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '1.31' THEN
        --    lv_Stranger_Victim := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '1.26' THEN
        --    lv_Violent_Sanctions_count := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '1.7' THEN
        --    lv_Age_at_First_Sanction := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.29' THEN
            io_offender_rsr_score_row.S1_29_DATE_CURRENT_CONVICTION := TO_DATE(lv_rec.FREE_FORMAT_ANSWER,'DD/MM/YYYY');
        --WHEN '2.2' THEN
        --    lv_S2Q2A := lv_rec.FREE_FORMAT_ANSWER;
        --WHEN '2.2t' THEN
        --NULL;
        WHEN '3.4' THEN
            io_offender_rsr_score_row.S3_Q4_SUITABLE_ACCOM := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '4.2' THEN
            io_offender_rsr_score_row.S4_Q2_UNEMPLOYED := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.4' THEN
            io_offender_rsr_score_row.S6_Q4_PARTNER_RELATIONSHIP := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.7.2.1da' THEN
            io_offender_rsr_score_row.S6_Q7_PERPETRATOR_PARTNER := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.7.2.2da' THEN
            io_offender_rsr_score_row.S6_Q7_PERPETRATOR_FAMILY := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.7.1.1da' THEN
            io_offender_rsr_score_row.S6_Q7_VICTIM_PARTNER := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.7.1.2da' THEN
            io_offender_rsr_score_row.S6_Q7_VICTIM_FAMILY := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '6.7da' THEN
            io_offender_rsr_score_row.S6_Q7_DOM_ABUSE := lv_rec.FREE_FORMAT_ANSWER; 
        /* Need to cnfirm what is happening with these values that are used from the RSR calcaulation
        WHEN '6.7da' THEN
            lv_S6Q7da := lv_rec.FREE_FORMAT_ANSWER;            
        WHEN '6.7.1' THEN
            IF  (lv_rec.FREE_FORMAT_ANSWER = 'PERPETRATOR') THEN
                lv_answer_code_1_7_1P := 'Y';
            ELSIF (lv_rec.FREE_FORMAT_ANSWER = 'VICTIM') THEN
                lv_answer_code_1_7_1V := 'Y';
            END IF;
        */
        WHEN '9.1' THEN
            io_offender_rsr_score_row.S9_Q1_ALCOHOL := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '9.2' THEN
            io_offender_rsr_score_row.S9_Q2_BINGE_DRINK := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '11.2' THEN
            io_offender_rsr_score_row.S11_Q2_IMPULSIVITY := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '11.4' THEN
            io_offender_rsr_score_row.S11_Q4_TEMPER_CONTROL := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '12.1' THEN
            io_offender_rsr_score_row.S12_Q1_PRO_CRIMINAL := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.1.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_MURDER := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.2.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_WOUNDING_GBH := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.9.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_KIDNAPPING := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.10.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_FIREARM := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.10.1_V2' THEN
            io_offender_rsr_score_row.R1_2_CURRENT_FIREARM := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.12.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_ROBBERY := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.6.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_AGGR_BURGLARY := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.13.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_WEAPON := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.8.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_CD_LIFE := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.7.2' || lv_V2 THEN
            io_offender_rsr_score_row.R1_2_PAST_ARSON := lv_rec.FREE_FORMAT_ANSWER;
        WHEN 'R1.2.13.1_V2' THEN
            io_offender_rsr_score_row.R1_2_CURRENT_WEAPON := lv_rec.FREE_FORMAT_ANSWER;
        WHEN '1.39' THEN
            io_offender_rsr_score_row.S1_39_OFFENDER_INTERVIEW := 'NO';
        ELSE
            NULL;
        END CASE;
--
    END LOOP;
--
--  However, if the assessment is HISTORIC and completed outside of the allowed time limit do NOT clone.
    IF ( is_historic_outside_period(r_latest_assessment_pk => p_in_oasys_set_pk ) ) THEN
--
        --io_offender_rsr_score_row.S1_34_CONTACT_ADULT_SCORE := NULL;
        --io_offender_rsr_score_row.S1_35_CONTACT_CHILD_SCORE := NULL;
        --io_offender_rsr_score_row.S1_36_INDECENT_IMAGES := NULL;
        --io_offender_rsr_score_row.S1_37_NON_CONTACT_SCORE := NULL;
        --io_offender_rsr_score_row.S1_38_COMMUNITY_DATE := NULL;
        --io_offender_rsr_score_row.S1_39_OFFENDER_INTERVIEW := NULL;
        io_offender_rsr_score_row.S3_Q4_SUITABLE_ACCOM := NULL;
        io_offender_rsr_score_row.S4_Q2_UNEMPLOYED := NULL;
        io_offender_rsr_score_row.S6_Q4_PARTNER_RELATIONSHIP := NULL;
        io_offender_rsr_score_row.S6_Q7_DOM_ABUSE := NULL;
        io_offender_rsr_score_row.S6_Q7_VICTIM_PARTNER := NULL;
        io_offender_rsr_score_row.S6_Q7_VICTIM_FAMILY := NULL;
        io_offender_rsr_score_row.S6_Q7_PERPETRATOR_PARTNER := NULL;
        io_offender_rsr_score_row.S6_Q7_PERPETRATOR_FAMILY := NULL;
        io_offender_rsr_score_row.S9_Q1_ALCOHOL := NULL;
        io_offender_rsr_score_row.S9_Q2_BINGE_DRINK := NULL;
        io_offender_rsr_score_row.S11_Q2_IMPULSIVITY := NULL;
        io_offender_rsr_score_row.S11_Q4_TEMPER_CONTROL := NULL;
        io_offender_rsr_score_row.S12_Q1_PRO_CRIMINAL := NULL;
        io_offender_rsr_score_row.R1_2_CURRENT_WEAPON := NULL;
        io_offender_rsr_score_row.R1_2_PAST_WEAPON := NULL;
        io_offender_rsr_score_row.R1_2_PAST_MURDER := NULL;
        io_offender_rsr_score_row.R1_2_PAST_WOUNDING_GBH := NULL;
        io_offender_rsr_score_row.R1_2_PAST_AGGR_BURGLARY := NULL;
        io_offender_rsr_score_row.R1_2_PAST_ARSON := NULL;
        io_offender_rsr_score_row.R1_2_PAST_CD_LIFE := NULL;
        io_offender_rsr_score_row.R1_2_PAST_KIDNAPPING := NULL;
        io_offender_rsr_score_row.R1_2_CURRENT_FIREARM := NULL;
        io_offender_rsr_score_row.R1_2_PAST_FIREARM := NULL;
        io_offender_rsr_score_row.R1_2_PAST_ROBBERY := NULL;
--
        io_offender_rsr_score_row.PREV_OSP_C_RISK_RED_TEXT := NULL;
--
    ELSE
        io_offender_rsr_score_row.PREV_OSP_C_RISK_RED_TEXT := NULL;
        IF ( NVL(oasys_set_api.g_row.OSP_C_RISK_RED_TEXT,'X') LIKE 'You have%' ) THEN
            io_offender_rsr_score_row.PREV_OSP_C_RISK_RED_TEXT := oasys_set_api.g_row.OSP_C_RISK_RED_TEXT;
        END IF;
    END IF;
--
    IF ( io_offender_rsr_score_row.S1_43_LAST_OFFENCE_DATE IS NOT NULL ) THEN
        lv_number_of_months := Months_between(trunc(sysdate), TO_DATE (io_offender_rsr_score_row.S1_43_LAST_OFFENCE_DATE,'DD/MM/YYYY'));
        IF ( lv_number_of_months > 60 ) THEN
            io_offender_rsr_score_row.S1_43_LAST_OFFENCE_DATE := NULL;
        END IF;
    END IF;
--
    io_offender_rsr_score_row.CLONED_FROM_OASYS_SET_PK := p_in_oasys_set_pk;
--
    lv_offence_block_rec := get_current_offence(pv_oasys_set_pk => p_in_oasys_set_pk);
--    
    io_offender_rsr_score_row.OFFENCE_CODE     := lv_offence_block_rec.OFFENCE_GROUP_CODE;
    io_offender_rsr_score_row.OFFENCE_SUBCODE  := lv_offence_block_rec.SUB_CODE;
--
    EXCEPTION
      WHEN others
      THEN
         elog_api.ins;
         raise;
  END update_from_assessment;
-- ==##
--  Initial population of a OFFENDER_RSR_SCORE row
FUNCTION populate_from_offender(ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE) return offender_rsr_scores%ROWTYPE
IS
--
lv_row              offender_rsr_scores%ROWTYPE := NULL;
--l_rsr_response_rec  mod_cms010_pkg.ty_rsr_response_rec;
--
BEGIN
--clog_api.ins(p_source=>'KELVIN',p_text=>'populate_from_offender'); 
--
--  Read offender    
    offender_api.g_row.offender_pk := ip_offender_pk;
    offender_api.get;
--
/*
[HTAB]OFFENDER_RSR_SCORE_PK
[HTAB]OFFENDER_PK (from the offender record)
[HTAB]PNC (from the offender record)
[HTAB]FAMILY_NAME (from the offender record)
[HTAB]FORENAME_1 (from the offender record)
[HTAB]DATE_OF_BIRTH (from the offender record)
[HTAB]CMS_PROB_NUMBER (from the offender record)
[HTAB]GENDER_CAT and GENDER_ELM (from the offender record)
[HTAB]INITIATION_DATE (system date and time)
[HTAB]RSR_SCORE_USER (Username)
[HTAB]RSR_SCORE_USER_NAME (forename1 and surname of the user)
[HTAB]RSR_STATUS (set to OPEN)
[HTAB]RSR_ALGORITHM_VERSION (set to the number on the global profile parameter)
*/
    lv_row := NULL;
    lv_row.OFFENDER_PK           := ip_offender_pk;
    lv_row.PNC                   := offender_api.g_row.PNC;
    lv_row.FAMILY_NAME           := offender_api.g_row.FAMILY_NAME;
    lv_row.FORENAME_1            := offender_api.g_row.FORENAME_1;
    lv_row.DATE_OF_BIRTH         := offender_api.g_row.DATE_OF_BIRTH; 
    lv_row.CMS_PROB_NUMBER       := offender_api.g_row.CMS_PROB_NUMBER;
    lv_row.GENDER_CAT            := offender_api.g_row.GENDER_CAT;
    lv_row.GENDER_ELM            := offender_api.g_row.GENDER_ELM;
    lv_row.INITIATION_DATE       := sysdate();
    lv_row.RSR_SCORE_USER        := app_ctx_pkg.get('UNAME'); --v('USER_ID');
    lv_row.RSR_SCORE_USER_NAME   := app_ctx_pkg.get(app_standard_context_pkg.gc_user_name);
    lv_row.RSR_STATUS            := assessment_utils_pkg.gc_v_ass_status_open;
--
    system_parameter_api.g_row.system_parameter_code := mod_pro010_pkg.gc_v_RSR_ALGORITHM_VERSION;
    system_parameter_api.get;
    lv_row.RSR_ALGORITHM_VERSION := system_parameter_api.g_row.system_parameter_value;
--
    --lv_row.RSR_ALGORITHM_VERSION := NULL; -- I don't belive this should be set till the calcaultion has been performed.
--
/*
    l_rsr_response_rec := mod_cms010_pkg.rsr_number_of_events(pv_offender_pk    => lv_row.OFFENDER_PK,
                                                              pv_user_code      => lv_row.RSR_SCORE_USER,
                                                              pv_area_est_code  => app_ctx_pkg.get(app_standard_context_pkg.gc_ct_area_est_code));
    l_rsr_response_rec := mod_cms010_pkg.rsr_get_offence(l_rsr_response_rec);
--  Check for error ?
    lv_row.OFFENCE_CODE     := l_rsr_response_rec.OFFENCE_GROUP_CODE;
    lv_row.OFFENCE_SUBCODE  := l_rsr_response_rec.SUB_CODE;
    lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
*/    
--
-- 6.39.0.0
/*
If the OFFENDER.CUSTODY_IND = 'Y'
[HTAB]Set OFFENDER_RSR_SCORES.PRISON_IND = 'C'
Otherwise
[HTAB]If OFFENDER.REMAND_IND = 'Y'
[HTAB][HTAB]Set OFFENDER_RSR_SCORES.PRISON_IND = 'R'
[HTAB]Otherwise
[HTAB][HTAB]Leave OFFENDER_RSR_SCORES.PRISON_IND blank (offender is not in prison)
[HTAB]End
[HTAB]Set OFFENDER_RSR_SCORES.PREV_OSP_C_RISK_RED_TEXT = NULL (may have cloned through so clear it out)
[HTAB]Set OFFENDER_RSR_SCORES. S1_43_LAST_OFFENCE_DATE = NULL (may have cloned through so clear it out)
End

*/
    IF ( NVL(offender_api.g_row.CUSTODY_IND,'X') = 'Y' ) THEN
        lv_row.PRISON_IND := 'C' ;
    ELSE
--
        IF ( NVL(offender_api.g_row.REMAND_IND,'X') = 'Y' ) THEN
            lv_row.PRISON_IND := 'R' ;
        ELSE
            lv_row.PRISON_IND := NULL;
        END IF;
        --lv_row.PREV_OSP_C_RISK_RED_TEXT := NULL;
        --lv_row.S1_43_LAST_OFFENCE_DATE  := NULL;
--
    END IF;
--
    return lv_row;
--
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END populate_from_offender;
--
--
--
--
FUNCTION new_rsr_from_assessment(ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE,
                                 ip_oasys_set_pk in OASYS_SET.OASYS_SET_PK%TYPE ) return offender_rsr_scores%ROWTYPE
IS
--
lv_row              offender_rsr_scores%ROWTYPE := NULL;
l_rsr_response_rec  mod_cms010_pkg.ty_rsr_response_rec;
--
BEGIN
--
    lv_row := NULL;
    lv_row := populate_from_offender(ip_offender_pk => ip_offender_pk);
--  select details from oasys_set
    update_from_assessment( p_in_oasys_set_pk           => ip_oasys_set_pk,
                            io_offender_rsr_score_row   => lv_row);
--
    l_rsr_response_rec := mod_cms010_pkg.rsr_number_of_events(pv_offender_pk    => lv_row.OFFENDER_PK,
                                                              pv_user_code      => lv_row.RSR_SCORE_USER,
                                                              pv_area_est_code  => app_ctx_pkg.get(app_standard_context_pkg.gc_ct_area_est_code));
    l_rsr_response_rec := mod_cms010_pkg.rsr_get_offence(p_rsr_response_rec => l_rsr_response_rec);
--
    lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--  UPDATING FROM DELIUS
/*
clog_api.ins(p_source=>'KELVIN',p_text=>'lv_row.OFFENCE_CODE [' || lv_row.OFFENCE_CODE || ']
# l_rsr_response_rec.OFFENCE_GROUP_CODE [' || l_rsr_response_rec.OFFENCE_GROUP_CODE ||']
lv_row.OFFENCE_SUBCODE [' || lv_row.OFFENCE_SUBCODE || ']
# l_rsr_response_rec.SUB_CODE [' || l_rsr_response_rec.SUB_CODE ||']'); 
*/
    IF ( NVL(lv_row.OFFENCE_CODE,'X') != l_rsr_response_rec.OFFENCE_GROUP_CODE OR
         NVL(lv_row.OFFENCE_SUBCODE,'X') != l_rsr_response_rec.SUB_CODE ) THEN
--
        lv_row.OFFENCE_CODE     := l_rsr_response_rec.OFFENCE_GROUP_CODE;
        lv_row.OFFENCE_SUBCODE  := l_rsr_response_rec.SUB_CODE;
        --lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--
        lv_row.S1_41_CURRENT_SEXUAL_MOT      := NULL;
        lv_row.S1_42_STRANGER_VICTIM         := NULL;
--clog_api.ins(p_source=>'KELVIN',p_text=>'CLEAR BAD :('); 
--
    END IF;
--    
    return lv_row;
--
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END new_rsr_from_assessment;
--
-- ======
FUNCTION new_rsr(ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE ) return offender_rsr_scores%ROWTYPE
IS
--
lv_row              offender_rsr_scores%ROWTYPE := NULL;
l_rsr_response_rec  mod_cms010_pkg.ty_rsr_response_rec;
--
BEGIN
--
    lv_row := NULL;
    lv_row := populate_from_offender(ip_offender_pk => ip_offender_pk);
--
    l_rsr_response_rec := mod_cms010_pkg.rsr_number_of_events(pv_offender_pk    => lv_row.OFFENDER_PK,
                                                              pv_user_code      => lv_row.RSR_SCORE_USER,
                                                              pv_area_est_code  => app_ctx_pkg.get(app_standard_context_pkg.gc_ct_area_est_code));
    l_rsr_response_rec := mod_cms010_pkg.rsr_get_offence(p_rsr_response_rec => l_rsr_response_rec);
--
    lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--  UPDATING FROM DELIUS
    IF ( NVL(lv_row.OFFENCE_CODE,'X') != l_rsr_response_rec.OFFENCE_GROUP_CODE OR
         NVL(lv_row.OFFENCE_SUBCODE,'X') != l_rsr_response_rec.SUB_CODE ) THEN
--
        lv_row.OFFENCE_CODE     := l_rsr_response_rec.OFFENCE_GROUP_CODE;
        lv_row.OFFENCE_SUBCODE  := l_rsr_response_rec.SUB_CODE;
        --lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--
        lv_row.S1_41_CURRENT_SEXUAL_MOT      := NULL;
        lv_row.S1_42_STRANGER_VICTIM         := NULL;

--
    END IF;
--    
    return lv_row;
--
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END new_rsr;
--
FUNCTION new_rsr_from_offender_rsr_score(ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE,
                                         ip_offender_rsr_scores_pk in offender_rsr_scores.offender_rsr_scores_pk%TYPE) return offender_rsr_scores%ROWTYPE
IS
--
lv_row                      offender_rsr_scores%ROWTYPE := NULL;
lv_3day_window              boolean := FALSE;
lv_allowed_time_limit       boolean := FALSE;
l_clone_hist_limit_mnths    number := to_number(app_utils_pkg.get_system_parameter(assessment_utils_pkg.gc_clone_time_limit_param_code));
l_rsr_response_rec  mod_cms010_pkg.ty_rsr_response_rec;
lv_number_of_months         number := -1;
--
BEGIN
--
    lv_row := NULL;
    lv_row := populate_from_offender(ip_offender_pk => ip_offender_pk);
--
    offender_rsr_scores_api.g_row                        := NULL;
    offender_rsr_scores_api.g_row.offender_rsr_scores_pk := ip_offender_rsr_scores_pk;
    offender_rsr_scores_api.get;
--
    lv_row.OFFENCE_CODE     := offender_rsr_scores_api.g_row.OFFENCE_CODE;
    lv_row.OFFENCE_SUBCODE  := offender_rsr_scores_api.g_row.OFFENCE_SUBCODE;
--
    IF ( offender_rsr_scores_api.g_row.INITIATION_DATE >= sysdate-3 ) THEN
        lv_3day_window := TRUE;
    END IF;
--
    IF ( offender_rsr_scores_api.g_row.DATE_COMPLETED > sysdate-l_clone_hist_limit_mnths ) THEN
        lv_allowed_time_limit := TRUE;
    END IF;
--
    lv_row.S1_8_AGE_AT_FIRST_SANCTION    := offender_rsr_scores_api.g_row.S1_8_AGE_AT_FIRST_SANCTION;
--    
    IF ( lv_3day_window ) THEN
        lv_row.S1_32_TOTAL_SANCTIONS         := offender_rsr_scores_api.g_row.S1_32_TOTAL_SANCTIONS;
        lv_row.S1_40_VIOLENT_SANCTIONS       := offender_rsr_scores_api.g_row.S1_40_VIOLENT_SANCTIONS;
        lv_row.S1_29_DATE_CURRENT_CONVICTION := offender_rsr_scores_api.g_row.S1_29_DATE_CURRENT_CONVICTION;
    END IF;
--    
    lv_row.S1_30_SEXUAL_ELEMENT          := offender_rsr_scores_api.g_row.S1_30_SEXUAL_ELEMENT;
--
    l_rsr_response_rec := mod_cms010_pkg.rsr_number_of_events(pv_offender_pk    => lv_row.OFFENDER_PK,
                                                              pv_user_code      => lv_row.RSR_SCORE_USER,
                                                              pv_area_est_code  => app_ctx_pkg.get(app_standard_context_pkg.gc_ct_area_est_code));
    l_rsr_response_rec := mod_cms010_pkg.rsr_get_offence(p_rsr_response_rec => l_rsr_response_rec);
--
    lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--    
    IF ( NVL(lv_row.OFFENCE_CODE,'X') != l_rsr_response_rec.OFFENCE_GROUP_CODE OR
         NVL(lv_row.OFFENCE_SUBCODE,'X') != l_rsr_response_rec.SUB_CODE ) THEN
--
        lv_row.OFFENCE_CODE     := l_rsr_response_rec.OFFENCE_GROUP_CODE;
        lv_row.OFFENCE_SUBCODE  := l_rsr_response_rec.SUB_CODE;
        --lv_row.CMS_EVENT_NUMBER := l_rsr_response_rec.event_no;
--
        lv_row.S1_41_CURRENT_SEXUAL_MOT      := NULL;
        lv_row.S1_42_STRANGER_VICTIM         := NULL;

--
    ELSE
--
        lv_row.S1_41_CURRENT_SEXUAL_MOT      := offender_rsr_scores_api.g_row.S1_41_CURRENT_SEXUAL_MOT;
        lv_row.S1_42_STRANGER_VICTIM         := offender_rsr_scores_api.g_row.S1_42_STRANGER_VICTIM;
--
    END IF;
--  
    lv_row.S1_33_DATE_RECENT_SEX_OFFENCE := offender_rsr_scores_api.g_row.S1_33_DATE_RECENT_SEX_OFFENCE;
    lv_row.S1_34_CONTACT_ADULT_SCORE     := offender_rsr_scores_api.g_row.S1_34_CONTACT_ADULT_SCORE;
    lv_row.S1_35_CONTACT_CHILD_SCORE     := offender_rsr_scores_api.g_row.S1_35_CONTACT_CHILD_SCORE;
    lv_row.S1_36_INDECENT_IMAGES         := offender_rsr_scores_api.g_row.S1_36_INDECENT_IMAGES;
    lv_row.S1_37_NON_CONTACT_SCORE       := offender_rsr_scores_api.g_row.S1_37_NON_CONTACT_SCORE;
--
    IF ( lv_3day_window ) THEN
        lv_row.S1_38_COMMUNITY_DATE          := offender_rsr_scores_api.g_row.S1_38_COMMUNITY_DATE;
    END IF;
--    
    lv_row.S1_39_OFFENDER_INTERVIEW      := 'NO'; --offender_rsr_scores_api.g_row.S1_39_OFFENDER_INTERVIEW;
--
    IF ( lv_allowed_time_limit ) THEN
        lv_row.S3_Q4_SUITABLE_ACCOM          := offender_rsr_scores_api.g_row.S3_Q4_SUITABLE_ACCOM;
        lv_row.S4_Q2_UNEMPLOYED              := offender_rsr_scores_api.g_row.S4_Q2_UNEMPLOYED;
        lv_row.S6_Q4_PARTNER_RELATIONSHIP    := offender_rsr_scores_api.g_row.S6_Q4_PARTNER_RELATIONSHIP;
        lv_row.S6_Q7_DOM_ABUSE               := offender_rsr_scores_api.g_row.S6_Q7_DOM_ABUSE;
        lv_row.S6_Q7_VICTIM_PARTNER          := offender_rsr_scores_api.g_row.S6_Q7_VICTIM_PARTNER;
        lv_row.S6_Q7_VICTIM_FAMILY           := offender_rsr_scores_api.g_row.S6_Q7_VICTIM_FAMILY;
        lv_row.S6_Q7_PERPETRATOR_PARTNER     := offender_rsr_scores_api.g_row.S6_Q7_PERPETRATOR_PARTNER;
        lv_row.S6_Q7_PERPETRATOR_FAMILY      := offender_rsr_scores_api.g_row.S6_Q7_PERPETRATOR_FAMILY;
        lv_row.S9_Q1_ALCOHOL                 := offender_rsr_scores_api.g_row.S9_Q1_ALCOHOL;
        lv_row.S9_Q2_BINGE_DRINK             := offender_rsr_scores_api.g_row.S9_Q2_BINGE_DRINK;
        lv_row.S11_Q2_IMPULSIVITY            := offender_rsr_scores_api.g_row.S11_Q2_IMPULSIVITY;
        lv_row.S11_Q4_TEMPER_CONTROL         := offender_rsr_scores_api.g_row.S11_Q4_TEMPER_CONTROL;
        lv_row.S12_Q1_PRO_CRIMINAL           := offender_rsr_scores_api.g_row.S12_Q1_PRO_CRIMINAL;
        lv_row.R1_2_CURRENT_WEAPON           := offender_rsr_scores_api.g_row.R1_2_CURRENT_WEAPON;
        lv_row.R1_2_PAST_WEAPON              := offender_rsr_scores_api.g_row.R1_2_PAST_WEAPON;
        lv_row.R1_2_PAST_MURDER              := offender_rsr_scores_api.g_row.R1_2_PAST_MURDER;
        lv_row.R1_2_PAST_WOUNDING_GBH        := offender_rsr_scores_api.g_row.R1_2_PAST_WOUNDING_GBH;
        lv_row.R1_2_PAST_AGGR_BURGLARY       := offender_rsr_scores_api.g_row.R1_2_PAST_AGGR_BURGLARY;
        lv_row.R1_2_PAST_ARSON               := offender_rsr_scores_api.g_row.R1_2_PAST_ARSON;
        lv_row.R1_2_PAST_CD_LIFE             := offender_rsr_scores_api.g_row.R1_2_PAST_CD_LIFE;
        lv_row.R1_2_PAST_KIDNAPPING          := offender_rsr_scores_api.g_row.R1_2_PAST_KIDNAPPING;
        lv_row.R1_2_CURRENT_FIREARM          := offender_rsr_scores_api.g_row.R1_2_CURRENT_FIREARM;
        lv_row.R1_2_PAST_FIREARM             := offender_rsr_scores_api.g_row.R1_2_PAST_FIREARM;
        lv_row.R1_2_PAST_ROBBERY             := offender_rsr_scores_api.g_row.R1_2_PAST_ROBBERY;
    END IF;
--
--
--  YES, but only if the previous RSR record was initiated within a 3 day window of this record being created
--
    IF ( lv_3day_window ) THEN
--
        lv_row.S1_43_LAST_OFFENCE_DATE := offender_rsr_scores_api.g_row.S1_43_LAST_OFFENCE_DATE;
        IF ( lv_row.S1_43_LAST_OFFENCE_DATE IS NOT NULL ) THEN
            lv_number_of_months := Months_between(trunc(sysdate), TO_DATE (lv_row.S1_43_LAST_OFFENCE_DATE,'DD/MM/YYYY'));
            IF ( lv_number_of_months > 60 ) THEN
            lv_row.S1_43_LAST_OFFENCE_DATE := NULL;
            ELSE
            lv_row.S1_43_LAST_OFFENCE_DATE := offender_rsr_scores_api.g_row.S1_43_LAST_OFFENCE_DATE;
            END IF;
        END IF;
--
        lv_row.PREV_OSP_C_RISK_RED_TEXT := NULL;
        IF ( NVL(offender_rsr_scores_api.g_row.OSP_C_RISK_RED_TEXT,'X') LIKE 'You have%' ) THEN
            lv_row.PREV_OSP_C_RISK_RED_TEXT := offender_rsr_scores_api.g_row.OSP_C_RISK_RED_TEXT;
        END IF;
    END IF;
--
    return lv_row;
--
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END new_rsr_from_offender_rsr_score;
--
--
--
-- Get / Create RSR record
-- ========================
PROCEDURE get_rsr_record(ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE,
                         op_offender_rsr_scores_pk IN OUT offender_rsr_scores.offender_rsr_scores_pk%TYPE )
IS
--
l_latest_oasys_set_pk   OFFENDER.OFFENDER_PK%TYPE;
l_initiation_date       date := TO_DATE('01/01/1900', 'DD/MM/YYYY');
lv_row                  offender_rsr_scores%ROWTYPE := NULL;
--
BEGIN
--
--  First see if we have a rsr record in process
    op_offender_rsr_scores_pk := NULL;
--
    FOR rec in (SELECT offender_rsr_scores_pk
                FROM OFFENDER_RSR_SCORES
                WHERE OFFENDER_PK = ip_offender_pk
                AND DATE_COMPLETED IS NULL 
                AND DELETED_DATE IS NULL)
    LOOP
    --
        op_offender_rsr_scores_pk := rec.offender_rsr_scores_pk;
        EXIT;
    --
    END LOOP;
--
    IF ( op_offender_rsr_scores_pk IS NULL ) THEN
--
            FOR rec in (SELECT offender_rsr_scores_pk, INITIATION_DATE
                        FROM
                        ( SELECT offender_rsr_scores_pk, INITIATION_DATE
                          FROM OFFENDER_RSR_SCORES
                          WHERE OFFENDER_PK = ip_offender_pk
                          AND DATE_COMPLETED IS NOT NULL
                          AND DELETED_DATE IS NULL
                          ORDER BY INITIATION_DATE DESC) 
                        WHERE ROWNUM = 1)
            LOOP
            --
                op_offender_rsr_scores_pk := rec.offender_rsr_scores_pk;
                l_initiation_date         := rec.INITIATION_DATE;
                EXIT;
            --
            END LOOP;

--
    --  Get the latest assessment, Excluding BCS
        l_latest_oasys_set_pk := offenders_pkg.get_latest_assessment(p_offender_pk  => ip_offender_pk, 
                                                                     p_include_bcs  => 'N');
--
        IF ( l_latest_oasys_set_pk IS NULL AND op_offender_rsr_scores_pk IS NULL ) THEN
            lv_row := new_rsr(ip_offender_pk   => ip_offender_pk);
        ELSE
        
--          Read offender 
            IF ( l_latest_oasys_set_pk IS NOT NULL ) THEN
            oasys_set_api.g_row.oasys_set_pk := l_latest_oasys_set_pk;
            oasys_set_api.get;
            ELSE
                oasys_set_api.g_row                 := NULL;
                oasys_set_api.g_row.initiation_date := TO_DATE('01/01/1900', 'DD/MM/YYYY');
            END IF;
--
            --
            -- Who the winner?
            IF ( oasys_set_api.g_row.initiation_date > l_initiation_date ) THEN
            --
                lv_row := new_rsr_from_assessment(ip_offender_pk   => ip_offender_pk,
                                                  ip_oasys_set_pk  => l_latest_oasys_set_pk);
            --
            ELSE
            --
                lv_row := new_rsr_from_offender_rsr_score(ip_offender_pk              => ip_offender_pk,
                                                          ip_offender_rsr_scores_pk   => op_offender_rsr_scores_pk);
            --
            END IF;
--
        END IF;
--
        offender_rsr_scores_api.g_row := lv_row;
--    
        offender_rsr_scores_api.ins;
--
        op_offender_rsr_scores_pk := offender_rsr_scores_api.g_row.offender_rsr_scores_pk;
--
    ELSE
--
--      The folllowing has been addedd for 6.39.0.0
--      Read offender    
        offender_api.g_row.offender_pk := ip_offender_pk;
        offender_api.get;
--
        OFFENDER_RSR_SCORES_api.g_row.OFFENDER_RSR_SCORES_pk := op_offender_rsr_scores_pk;
        OFFENDER_RSR_SCORES_api.get; 
--
        IF ( NVL(offender_api.g_row.CUSTODY_IND,'X') = 'Y' ) THEN
            OFFENDER_RSR_SCORES_api.g_row.PRISON_IND := 'C' ;
        ELSE
--
            IF ( NVL(offender_api.g_row.REMAND_IND,'X') = 'Y' ) THEN
                OFFENDER_RSR_SCORES_api.g_row.PRISON_IND := 'R' ;
            ELSE
                OFFENDER_RSR_SCORES_api.g_row.PRISON_IND := NULL;
            END IF;
--
        END IF;
--
        OFFENDER_RSR_SCORES_api.upd; 
--
    END IF;
--
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END get_rsr_record;
--
-- Get latest completed row for cloning (Assessment_utils).
FUNCTION get_latest_record(ip_oasys_set_pk OASYS_SET.oasys_set_pk%TYPE,
                           ip_offender_pk in OFFENDER.OFFENDER_PK%TYPE) RETURN offender_rsr_scores.offender_rsr_scores_pk%TYPE
IS
--
lv_offender_rsr_scores_pk offender_rsr_scores.offender_rsr_scores_pk%TYPE := NULL;
--
BEGIN
--
--  IF there are no previous assessments
    IF ( ip_oasys_set_pk IS NULL ) THEN
--
--      Get the most resent completed RSR for this offender
        FOR lv_row IN (SELECT offender_rsr_scores_pk
                       FROM
                        ( SELECT ORS.offender_rsr_scores_pk
                          FROM OFFENDER_RSR_SCORES ORS
                          WHERE ORS.OFFENDER_PK = ip_offender_pk
                          AND ORS.DATE_COMPLETED IS NOT NULL
                          AND ORS.DELETED_DATE IS NULL
                          ORDER BY ORS.DATE_COMPLETED DESC) 
                       WHERE ROWNUM = 1)
        LOOP
--
            lv_offender_rsr_scores_pk := lv_row.offender_rsr_scores_pk;
--
        END LOOP;
--
    ELSE
--
        FOR lv_row IN (SELECT offender_rsr_scores_pk
                       FROM
                        ( SELECT ORS.offender_rsr_scores_pk
                          FROM OFFENDER_RSR_SCORES ORS
                          LEFT OUTER JOIN OASYS_ASSESSMENT_GROUP OAP
                          ON ORS.OFFENDER_PK = OAP.OFFENDER_PK
                          LEFT OUTER JOIN OASYS_SET OS
                          ON OAP.OASYS_ASSESSMENT_GROUP_PK = OS.OASYS_ASSESSMENT_GROUP_PK
                          WHERE OS.oasys_set_pk = ip_oasys_set_pk
                          AND ORS.DATE_COMPLETED IS NOT NULL
                          AND ORS.DELETED_DATE IS NULL
                          AND ORS.DATE_COMPLETED >= OS.DATE_COMPLETED --INITIATION_DATE
                          ORDER BY ORS.DATE_COMPLETED DESC) 
                       WHERE ROWNUM = 1)
        LOOP
--
            lv_offender_rsr_scores_pk := lv_row.offender_rsr_scores_pk;
--
        END LOOP;
--
    END IF;
--    
    RETURN lv_offender_rsr_scores_pk;
--    
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END get_latest_record;
--
-- Get latest completed row for cloning (Assessment_utils).
FUNCTION exist_wip(p_offender_pk in OFFENDER.OFFENDER_PK%TYPE) RETURN BOOLEAN
IS
--
lv_boolean  boolean := FALSE;
--
BEGIN
--
    FOR lv_row IN (SELECT offender_rsr_scores_pk
                   FROM
                    ( SELECT ORS.offender_rsr_scores_pk
                      FROM OFFENDER_RSR_SCORES ORS
                      WHERE ORS.OFFENDER_PK = p_offender_pk
                      AND ORS.DATE_COMPLETED IS NULL
                      AND ORS.DELETED_DATE IS NULL
                    ) 
                   WHERE ROWNUM = 1)
    LOOP
--
        lv_boolean := TRUE;
--
    END LOOP;
--    
    RETURN lv_boolean;
--    
EXCEPTION when others then
    elog_api.ins;
    raise;
--
END exist_wip;
end  OFFENDER_RSR_SCORES_PKG;
/