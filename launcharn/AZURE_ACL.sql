--
-- AZURE ACL - One ACL to cover all AZure IPs - CL 
--
BEGIN
    DBMS_NETWORK_ACL_ADMIN.CREATE_ACL
    ('azure_permissions.xml'
    , 'ACL for SysTest server'
    , 'EOR'
    , TRUE
    , 'connect');
exception
	when others then null;
end;
/

begin
    DBMS_NETWORK_ACL_ADMIN.ASSIGN_ACL
    ('azure_permissions.xml'
    , '10.0.1.*');
end;
/

begin
    DBMS_NETWORK_ACL_ADMIN.ADD_PRIVILEGE
    ('azure_permissions.xml'
    , 'APEX_180200'
    , TRUE
    , 'connect');
end;
/

begin
    DBMS_NETWORK_ACL_ADMIN.ADD_PRIVILEGE
    ('azure_permissions.xml'
    , 'EOR'
    , TRUE
    , 'connect');

END;
/


begin
    DBMS_NETWORK_ACL_ADMIN.ADD_PRIVILEGE
    ('azure_permissions.xml'
    , 'EORAPP'
    , TRUE
    , 'connect');

END;
/

COMMIT;

--select * from dba_network_acls;

--select * from dba_network_acl_privileges;

--select * from eor.system_parameter_mv;

--Remove
--exec DBMS_NETWORK_ACL_ADMIN.DROP_ACL('iom_permissions.xml');