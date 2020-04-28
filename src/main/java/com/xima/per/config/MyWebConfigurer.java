package com.xima.per.config;

import com.xima.per.interceptor.LoginInterceptor;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author zd
 * @version v1.0
 * @2020 04 21 21 07
 * 作用：使拦截器生效
 * /index 与 /index.html 是不同的，也就是说 /index 会触发拦截器而 /index.html 不会，
 * 但根据拦截器 LoginInterceptor 中我们定义的判断条件，以 /index 开头的路径都会被转发，包括 index.html
 */
@SpringBootConfiguration
public class MyWebConfigurer implements WebMvcConfigurer {

    @Bean
    public LoginInterceptor getLoginInterceptor(){
        return new LoginInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getLoginInterceptor()).addPathPatterns("/**").excludePathPatterns("/index.html");
    }
}
