package com.xima.per.config;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * @author: Pxn
 * @date: 2019/12/3 23:12
 */
@EnableWebSecurity
public class MySecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable();
        /*http.authorizeRequests().antMatchers("/") .permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/userlogin");*/
    }
}
