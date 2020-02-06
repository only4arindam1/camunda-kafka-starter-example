package com.camunda.poc.starter.usecase.renewal.entity;

import org.hibernate.annotations.CreationTimestamp;

import javax.annotation.Generated;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="act_ru_task")
public class CamundaTask {

	public CamundaTask(){};
	public CamundaTask(long leaseId, long taskId){ }
	
    @Id
    @Column(nullable=false, name="ID_")
    private String id;

    @Column(nullable=false, name="NAME_")
    String name;

    public String getId(){
    	return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
