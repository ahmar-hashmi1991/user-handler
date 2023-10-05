export const ELIG_GET_QUERIES = {
    getEidByEmail: "SELECT eid FROM eligibility_list where case when shop_email = ? then 1 when email = ? then 1 else 0 end = 1",
    getEmailByEid: "SELECT COALESCE(shop_email, email) as email FROM eligibility_list where eid = ?",
    getEligibilityRulesByEmployerId: "SELECT eligibility_rules FROM employers where id = ?",
    getEmployerIdByEid: "SELECT employer_id FROM eligibility_list where eid=?"
}

export const MED_GET_QUERIES = {
    getUidByEid: "SELECT uid FROM eligibility_b2b_data where eid=?",
    getCurrAppVersionByUid: "SELECT current_app_ver FROM session where current_app_ver is not null and uid = ? order by openLocalUTC desc LIMIT 1"
}