    FUNCTION send_json (p_url varchar2) return varchar2
    is
        req utl_http.req;
        res utl_http.resp;
        name varchar2(4000);
        buffer varchar2(4000); 
        content varchar2(4000) := '{"code":100,"id": "APA"}';   
    BEGIN
    
        req := utl_http.begin_request(p_url, 'POST',' HTTP/1.1');
        utl_http.set_header(req, 'user-agent', 'mozilla/4.0'); 
        utl_http.set_header(req, 'content-type', 'application/json'); 
        utl_http.set_header(req, 'Content-Length', length(content));
        
        utl_http.write_text(req, content);
        res := utl_http.get_response(req);
    
        utl_http.read_line(res, buffer);
        utl_http.end_response(res);
        
        return buffer;
    END send_json;

    
    FUNCTION cltest return varchar2
    is
      l_return varchar2(2000);
    BEGIN
      clog_api.ins(p_text => 'CARL-ASS010', p_source => 'returnurl='||APEX_UTIL.HOST_URL||'/ords/'||APEX_PAGE.GET_URL); --||' prepared='||APEX_UTIL.PREPARE_URL(APEX_PAGE.GET_URL)
      --
      l_return := 'http://www.google.com';

      return l_return;
    EXCEPTION WHEN OTHERS THEN
        elog_api.ins;
        RAISE;
    END cltest;